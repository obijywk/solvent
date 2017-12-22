#include <napi.h>

using namespace Napi;

Value Test(const CallbackInfo& callback_info) {
  return String::New(callback_info.Env(), "Hello");
}

Object Init(Env env, Object exports) {
  exports.Set(String::New(env, "test"), Function::New(env, Test));
  return exports;
}

NODE_API_MODULE(nutrimatic, Init);
