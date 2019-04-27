#include <julia.h>
#include <napi.h>

#include <condition_variable>
#include <deque>
#include <future>
#include <mutex>
#include <thread>
#include <vector>

using namespace Napi;

class Worker {
  bool running = true;
  std::thread t;
  std::mutex mu;
  std::condition_variable cond;
  std::deque<std::function<void()>> tasks;

 public:
  Worker() : t{&Worker::RunThread, this} {}
  ~Worker() {
    {
      std::unique_lock<std::mutex> lock(mu);
      running = false;
    }
    cond.notify_one();
    t.join();
  }

  template <typename F> auto Spawn(const F& f) -> std::packaged_task<decltype(f())()> {
    std::packaged_task<decltype(f())()> task(f);
    {
      std::unique_lock<std::mutex> lock(mu);
      tasks.push_back([&task] { task(); });
    }
    cond.notify_one();
    return task;
  }

  template <typename F> auto Run(const F& f) -> decltype(f()) { return Spawn(f).get_future().get(); }

 private:
  void RunThread() {
    while (true) {
      std::function<void()> task;
      {
        std::unique_lock<std::mutex> lock(mu);
        while (tasks.empty() && running) {
          cond.wait(lock);
        }
        if (!running) {
          break;
        }
        task = std::move(tasks.front());
        tasks.pop_front();
      }
      task();
    }
  }
};

Worker julia_worker;

jl_function_t* julia_corpus_function;
jl_function_t* julia_analyze_function;
jl_function_t* julia_getindex_function;

jl_value_t* julia_corpus;

jl_array_t* ConvertNodeStringArrayToJuliaArray(const Value& node_array_value) {
  Array node_array = node_array_value.As<Array>();
  uint32_t node_array_length = node_array.Length();

  std::vector<std::string> strings(node_array_length);
  for (uint32_t i = 0; i < node_array_length; i++) {
    String node_string = Value(node_array[i]).As<String>();
    strings[i] = node_string.Utf8Value();
  }

  jl_array_t* julia_array;
  julia_worker.Run([&] {
    jl_value_t* julia_array_type = jl_apply_array_type(jl_string_type, 1);
    julia_array = jl_alloc_array_1d(julia_array_type, node_array_length);
    for (uint32_t i = 0; i < node_array_length; i++) {
      jl_value_t* julia_string = jl_cstr_to_string(strings[i].c_str());
      jl_arrayset(julia_array, julia_string, i);
    }
  });

  return julia_array;
}

class BuildCorpusWorker : public AsyncWorker {
 public:
  BuildCorpusWorker(
      Function& callback,
      jl_function_t* julia_corpus_function,
      jl_array_t* julia_words_array,
      jl_value_t** julia_corpus)
      :
      AsyncWorker(callback),
      julia_corpus_function(julia_corpus_function),
      julia_words_array(julia_words_array),
      julia_corpus(julia_corpus) {}
  ~BuildCorpusWorker() {}

  void Execute() {
    julia_worker.Run([&] {
      *julia_corpus = jl_call1(julia_corpus_function, (jl_value_t*) julia_words_array);
      if (jl_exception_occurred()) {
        error_string = jl_typeof_str(jl_exception_occurred());
      } else if (*julia_corpus == nullptr) {
        error_string = "Collective.jl corpus creation failed";
      }
    });
  }

  void OnOK() {
    HandleScope scope(Env());
    if (!error_string.empty()) {
      Callback().Call({String::New(Env(), error_string)});
    } else {
      Callback().Call({Env().Null()});
    }
  }

 private:
  jl_function_t* julia_corpus_function;
  jl_array_t* julia_words_array;
  jl_value_t** julia_corpus;
  std::string error_string;
};

Value BuildCorpus(const CallbackInfo& callback_info) {
  Env env = callback_info.Env();

  if (callback_info.Length() != 2) {
    TypeError::New(env, "Wrong number of arguments; expected 2").ThrowAsJavaScriptException();
    return env.Null();
  }

  Value node_words_value = callback_info[0];
  if (!node_words_value.IsArray()) {
    TypeError::New(env, "Wrong type of argument; expected array").ThrowAsJavaScriptException();
    return env.Null();
  }

  Value callback_function_value = callback_info[1];
  if (!callback_function_value.IsFunction()) {
    TypeError::New(env, "Wrong type of argument; expected function").ThrowAsJavaScriptException();
    return env.Null();
  }
  Function callback_function = callback_function_value.As<Function>();

  jl_array_t* julia_words_array = ConvertNodeStringArrayToJuliaArray(node_words_value);

  BuildCorpusWorker* worker = new BuildCorpusWorker(
    callback_function,
    julia_corpus_function,
    julia_words_array,
    &julia_corpus);
  worker->Queue();

  return env.Null();
}

typedef struct Result {
  std::string description;
  double probability;
  std::vector<bool> satisfied;
} Result;

Value Analyze(const CallbackInfo& callback_info) {
  Env env = callback_info.Env();

  if (callback_info.Length() != 2) {
    TypeError::New(env, "Wrong number of arguments; expected 2").ThrowAsJavaScriptException();
    return env.Null();
  }

  Value node_words_value = callback_info[0];
  if (!node_words_value.IsArray()) {
    TypeError::New(env, "Wrong type of argument; expected array").ThrowAsJavaScriptException();
    return env.Null();
  }

  Value node_allowed_misses_value = callback_info[1];
  if (!node_allowed_misses_value.IsNumber()) {
    TypeError::New(env, "Wrong type of argument; expected number").ThrowAsJavaScriptException();
    return env.Null();
  }

  if (julia_corpus == nullptr) {
    Error::New(env, "Collective.jl corpus was not created").ThrowAsJavaScriptException();
    return env.Null();
  }

  jl_array_t* julia_words_array = ConvertNodeStringArrayToJuliaArray(node_words_value);
  uint32_t node_allowed_misses = node_allowed_misses_value.As<Number>().Uint32Value();

  std::string error_message;
  jl_array_t* julia_results;
  std::vector<Result> results;
  julia_worker.Run([&] {
    julia_results = (jl_array_t*) jl_call3(
      julia_analyze_function,
      julia_corpus,
      (jl_value_t*) julia_words_array,
      jl_box_uint32(node_allowed_misses));

    if (jl_exception_occurred()) {
      error_message = "Julia exception: ";
      error_message.append(jl_typeof_str(jl_exception_occurred()));
    }

    if (julia_results != nullptr) {
      for (size_t i = 0; i < jl_array_len(julia_results); i++) {
        jl_value_t* julia_result = jl_arrayref(julia_results, i);

        Result result;
        result.description = std::string(jl_string_ptr(jl_get_field(julia_result, "description")));
        result.probability = jl_unbox_float64(jl_get_field(julia_result, "probability"));

        jl_value_t* julia_satisfied = jl_get_field(julia_result, "satisfied");
        for (size_t j = 0; j < jl_array_len(julia_satisfied); j++) {
          jl_value_t* julia_satisfied_word = jl_call2(julia_getindex_function, julia_satisfied, jl_box_uint32(j + 1));
          int8_t satisfied_word = jl_unbox_bool(julia_satisfied_word);
          result.satisfied.push_back((bool) satisfied_word);
        }

        results.push_back(result);
      }
    }
  });

  if (!error_message.empty()) {
    Error::New(env, error_message).ThrowAsJavaScriptException();
    return env.Null();
  }

  if (julia_results == nullptr) {
    Error::New(env, "Collective.jl analyze failed").ThrowAsJavaScriptException();
    return env.Null();
  }

  Array node_results = Array::New(env, results.size());
  for (uint32_t i = 0; i < results.size(); i++) {
    const Result& result = results[i];

    Object node_result = Object::New(env);
    node_result["description"] = String::New(env, result.description);
    node_result["probability"] = Number::New(env, result.probability);

    Array node_satisfied = Array::New(env);
    node_result["satisfied"] = node_satisfied;
    size_t node_satisfied_index = 0;
    Array node_words_array = node_words_value.As<Array>();
    for (size_t j = 0; j < node_words_array.Length(); j++) {
      if (result.satisfied[j]) {
        Value node_word = node_words_array[j];
        node_satisfied[node_satisfied_index++] = node_word;
      }
    }

    node_results[i] = node_result;
  }

  return node_results;
}

Object Init(Env env, Object exports) {
  jl_module_t* julia_collective = nullptr;

  std::string error_string;
  julia_worker.Run([&] {
    jl_init(nullptr);
    jl_eval_string("using Collective");
    if (jl_exception_occurred()) {
      error_string = jl_typeof_str(jl_exception_occurred());
      return;
    }
    jl_eval_string("gc()");
    if (jl_exception_occurred()) {
      error_string = jl_typeof_str(jl_exception_occurred());
      return;
    }
    julia_collective = (jl_module_t*) jl_eval_string("Collective");
    if (jl_exception_occurred()) {
      error_string = jl_typeof_str(jl_exception_occurred());
      return;
    }
  });

  if (!error_string.empty()) {
    Error::New(env, error_string).ThrowAsJavaScriptException();
  } else if (julia_collective == nullptr) {
    Error::New(env, "Collective.jl Julia package not found.").ThrowAsJavaScriptException();
  } else {
    julia_worker.Run([&] {
      julia_corpus_function = jl_get_function(julia_collective, "Corpus");
      julia_analyze_function = jl_get_function(julia_collective, "analyze");
      julia_getindex_function = jl_get_function(jl_base_module, "getindex");
    });
  }

  exports.Set(String::New(env, "buildCorpus"), Function::New(env, BuildCorpus));
  exports.Set(String::New(env, "analyze"), Function::New(env, Analyze));
  return exports;
}

NODE_API_MODULE(collective_jl, Init);
