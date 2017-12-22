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
StdVectorFst space;

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

  ParseExpr(" ", &space, true);

  return env.Null();
}

Value Search(const CallbackInfo& callback_info) {
  Env env = callback_info.Env();

  if (symbol_table == nullptr || index_file == nullptr) {
    Error::New(env, "nutrimatic is not initialized").ThrowAsJavaScriptException();
    return env.Null();
  }

  if (callback_info.Length() != 1) {
    TypeError::New(env, "Wrong number of arguments; expected 1").ThrowAsJavaScriptException();
    return env.Null();
  }

  Value pattern_value = callback_info[0];
  if (!pattern_value.IsString()) {
    TypeError::New(env, "Wrong type of argument; expected string").ThrowAsJavaScriptException();
    return env.Null();
  }
  String pattern_string = pattern_value.As<String>();

  StdVectorFst parsed;
  parsed.SetInputSymbols(symbol_table);
  parsed.SetOutputSymbols(symbol_table);
  const char *p = ParseExpr(pattern_string.Utf8Value().c_str(), &parsed, false);
  if (p == nullptr || *p != '\0') {
    TypeError::New(env, "Failed to parse search pattern").ThrowAsJavaScriptException();
    return env.Null();
  }

  // Require a space at the end, so the matches must be complete words.
  Concat(&parsed, space);

  ExprFilter expr_filter(parsed);
  IndexReader index_reader(index_file);
  SearchDriver search_driver(&index_reader, &expr_filter, expr_filter.start(), 1e-6);

  Array results = Array::New(env);
  while (results.Length() < 10) {
    if (search_driver.step()) {
      if (search_driver.text == nullptr) {
        break;
      }
      int text_length = strlen(search_driver.text);
      while (text_length > 0 && search_driver.text[text_length - 1] == ' ') {
        --text_length;
      }
      Object result = Object::New(env);
      result["score"] = Number::New(env, search_driver.score);
      result["text"] = String::New(env, search_driver.text, text_length);
      results[results.Length()] = result;
    }
  }

  return results;
}

Object Init(Env env, Object exports) {
  exports.Set(String::New(env, "initialize"), Function::New(env, Initialize));
  exports.Set(String::New(env, "search"), Function::New(env, Search));
  return exports;
}

NODE_API_MODULE(nutrimatic, Init);
