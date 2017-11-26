{
  "targets": [
    {
      "target_name": "collective_jl",
      "sources": [
        "src/server/lib/collective_jl.cpp"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
        "/usr/include/julia"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "cflags!": ["-fno-exceptions"],
      "cflags_cc!": ["-fno-exceptions"],
      "defines": [
        "NAPI_CPP_EXCEPTIONS"
      ]
    },
    {
      "target_name": "julia_loader",
      "sources": [
        "src/server/lib/julia_loader.cpp"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
        "/usr/include/julia"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "cflags!": ["-fno-exceptions"],
      "cflags_cc!": ["-fno-exceptions"],
      "defines": [
        "NAPI_CPP_EXCEPTIONS",
        "JULIA_LIB_PATH=\"/usr/lib/x86_64-linux-gnu/libjulia.so\""
      ]
    }
  ]
}
