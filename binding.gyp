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
      "libraries": [
        "/usr/lib/x86_64-linux-gnu/libstdc++.so.6"
      ],
      "cflags!": ["-fno-exceptions"],
      "cflags_cc!": ["-fno-exceptions"],
      "ldflags!": [
        "-Wl,-rpath,/usr/lib/x86_64-linux-gnu",
        "-ljulia"
      ],
      "defines": [
        "NAPI_CPP_EXCEPTIONS",
        "JULIA_ENABLE_THREADING=1"
      ]
    }
  ]
}
