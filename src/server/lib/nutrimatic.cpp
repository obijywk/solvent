#include "index.h"
#include "search.h"
#include "expr.h"

#include "fst/concat.h"

#include <napi.h>
#include <stdio.h>

using namespace Napi;
using namespace fst;

SymbolTable* symbol_table = nullptr;
FILE* index_file = nullptr;
IndexReader* index_reader = nullptr;
StdVectorFst space;

class SearchIterator : public Napi::ObjectWrap<SearchIterator> {
  public:
    static void Initialize(Napi::Env& env, Napi::Object& target) {
      Function constructor = DefineClass(env, "SearchIterator", {
        InstanceMethod("next", &SearchIterator::Next),
      });
      target.Set("SearchIterator", constructor);
    }

    SearchIterator(const CallbackInfo& callback_info) : ObjectWrap(callback_info) {
      Napi::Env env = callback_info.Env();

      if (symbol_table == nullptr || index_reader == nullptr) {
        Error::New(env, "nutrimatic is not initialized").ThrowAsJavaScriptException();
        return;
      }

      if (callback_info.Length() != 1) {
        TypeError::New(env, "Wrong number of arguments; expected 1").ThrowAsJavaScriptException();
        return;
      }

      Napi::Value pattern_value = callback_info[0];
      if (!pattern_value.IsString()) {
        TypeError::New(env, "Wrong type of argument; expected string").ThrowAsJavaScriptException();
        return;
      }
      String pattern_string = pattern_value.As<String>();

      parsed_pattern_.SetInputSymbols(symbol_table);
      parsed_pattern_.SetOutputSymbols(symbol_table);
      const char *p = ParseExpr(pattern_string.Utf8Value().c_str(), &parsed_pattern_, false);
      if (p == nullptr || *p != '\0') {
        TypeError::New(env, "Failed to parse search pattern").ThrowAsJavaScriptException();
        return;
      }

      // Require a space at the end, so the matches must be complete words.
      Concat(&parsed_pattern_, space);

      expr_filter_.reset(new ExprFilter(parsed_pattern_));
      search_driver_.reset(new SearchDriver(index_reader, expr_filter_.get(), expr_filter_->start(), 1e-6));
    }

    Napi::Value Next(const CallbackInfo& callback_info) {
      Napi::Env env = callback_info.Env();

      while (!search_driver_->step()) {}

      Object item = Object::New(env);
      if (search_driver_->text == nullptr) {
        item["done"] = Boolean::New(env, true);
      } else {
        item["done"] = Boolean::New(env, false);
        int text_length = strlen(search_driver_->text);
        while (text_length > 0 && search_driver_->text[text_length - 1] == ' ') {
          --text_length;
        }
        Object result = Object::New(env);
        result["score"] = Number::New(env, search_driver_->score);
        result["text"] = String::New(env, search_driver_->text, text_length);
        item["value"] = result;
      }
      return item;
    }

  private:
    StdVectorFst parsed_pattern_;
    std::unique_ptr<ExprFilter> expr_filter_;
    std::unique_ptr<SearchDriver> search_driver_;
};

Value Initialize(const CallbackInfo& callback_info) {
  Env env = callback_info.Env();

  symbol_table = new SymbolTable("chars");
  symbol_table->AddSymbol("epsilon", 0);
  symbol_table->AddSymbol("space", ' ');
  for (int i = 33; i <= 127; ++i) {
    symbol_table->AddSymbol(string(1, i), i);
  }

  index_file = fopen("data/wikipedia.index", "rb");
  if (index_file == nullptr) {
    Error::New(env, "failed to open data/wikipedia.index").ThrowAsJavaScriptException();
    return env.Null();
  }
  index_reader = new IndexReader(index_file);

  ParseExpr(" ", &space, true);

  return env.Null();
}

Object Init(Env env, Object exports) {
  exports.Set(String::New(env, "initialize"), Function::New(env, Initialize));
  SearchIterator::Initialize(env, exports);
  return exports;
}

NODE_API_MODULE(nutrimatic, Init);
