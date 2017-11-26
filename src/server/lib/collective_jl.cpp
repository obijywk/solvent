#include <iostream>

#include <dlfcn.h>
#include <julia.h>
#include <napi.h>

using namespace Napi;

jl_module_t* julia_collective;
jl_value_t* julia_corpus;

jl_array_t* ConvertNodeStringArrayToJuliaArray(const Value& node_array_value) {
  Array node_array = node_array_value.As<Array>();

  jl_value_t* julia_array_type = jl_apply_array_type(jl_string_type, 1);
  jl_array_t* julia_array = jl_alloc_array_1d(julia_array_type, node_array.Length());

  for (uint32_t i = 0; i < node_array.Length(); i++) {
    String node_string = Value(node_array[i]).As<String>();
    jl_value_t* julia_string = jl_cstr_to_string(node_string.Utf8Value().c_str());
    jl_arrayset(julia_array, julia_string, i);
  }

  return julia_array;
}

Value BuildCorpus(const CallbackInfo& callback_info) {
  Env env = callback_info.Env();

  if (callback_info.Length() != 1) {
    TypeError::New(env, "Wrong number of arguments; expected 1").ThrowAsJavaScriptException();
    return env.Null();
  }

  Value node_words_value = callback_info[0];
  if (!node_words_value.IsArray()) {
    TypeError::New(env, "Wrong type of argument; expected array").ThrowAsJavaScriptException();
    return env.Null();
  }

  jl_array_t* julia_words_array = ConvertNodeStringArrayToJuliaArray(node_words_value);
  jl_function_t* julia_corpus_function = jl_get_function(julia_collective, "Corpus");
  julia_corpus = jl_call1(julia_corpus_function, (jl_value_t*) julia_words_array);

  return env.Null();
}

Value Analyze(const CallbackInfo& callback_info) {
  Env env = callback_info.Env();

  if (callback_info.Length() != 1) {
    TypeError::New(env, "Wrong number of arguments; expected 1").ThrowAsJavaScriptException();
    return env.Null();
  }

  Value node_words_value = callback_info[0];
  if (!node_words_value.IsArray()) {
    TypeError::New(env, "Wrong type of argument; expected array").ThrowAsJavaScriptException();
    return env.Null();
  }

  jl_array_t* julia_words_array = ConvertNodeStringArrayToJuliaArray(node_words_value);
  jl_function_t* julia_analyze_function = jl_get_function(julia_collective, "analyze");
  jl_array_t* julia_results = (jl_array_t*) jl_call3(
    julia_analyze_function,
    julia_corpus,
    (jl_value_t*) julia_words_array,
    jl_box_uint32(0));

  Array node_results = Array::New(env, jl_array_len(julia_results));
  jl_function_t* julia_getindex_function = jl_get_function(jl_base_module, "getindex");
  for (size_t i = 0; i < jl_array_len(julia_results); i++) {
    jl_value_t* julia_result = jl_arrayref(julia_results, i);
    Object node_result = Object::New(env);

    const char* description = jl_string_ptr(jl_get_field(julia_result, "description"));
    node_result["description"] = String::New(env, description);

    double probability = jl_unbox_float64(jl_get_field(julia_result, "probability"));
    node_result["probability"] = Number::New(env, probability);

    jl_value_t* julia_satisfied = jl_get_field(julia_result, "satisfied");
    Array node_satisfied = Array::New(env);
    node_result["satisfied"] = node_satisfied;
    size_t node_satisfied_index = 0;
    Array node_words_array = node_words_value.As<Array>();
    for (size_t j = 0; j < node_words_array.Length(); j++) {
      jl_value_t* julia_satisfied_word = jl_call2(julia_getindex_function, julia_satisfied, jl_box_uint32(j + 1));
      int8_t satisfied_word = jl_unbox_bool(julia_satisfied_word);
      if (satisfied_word) {
        Value node_word = node_words_array[j];
        node_satisfied[node_satisfied_index++] = node_word;
      }
    }

    node_results[i] = node_result;
  }

  return node_results;
}

Object Init(Env env, Object exports) {
  dlopen("/usr/lib/x86_64-linux-gnu/libjulia.so", RTLD_GLOBAL | RTLD_LAZY);
  jl_init(nullptr);
  jl_eval_string("using Collective");
  julia_collective = (jl_module_t*) jl_eval_string("Collective");

  exports.Set(String::New(env, "buildCorpus"), Function::New(env, BuildCorpus));
  exports.Set(String::New(env, "analyze"), Function::New(env, Analyze));
  return exports;
}

NODE_API_MODULE(collective_jl, Init);
