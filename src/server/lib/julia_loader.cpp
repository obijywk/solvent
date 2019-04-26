#include <dlfcn.h>
#include <julia.h>
#include <napi.h>

using namespace Napi;

Object Init(Env env, Object exports) {
  dlopen(JULIA_LIB_PATH, RTLD_GLOBAL | RTLD_LAZY);
  return exports;
}

NODE_API_MODULE(julia_loader, Init);
