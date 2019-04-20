{
  "targets": [
    {
      "target_name": "collective_jl",
      "sources": [
        "src/server/lib/collective_jl.cpp"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
        "/opt/julia/include/julia"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "defines": [
        "NAPI_DISABLE_CPP_EXCEPTIONS"
      ]
    },
    {
      "target_name": "julia_loader",
      "sources": [
        "src/server/lib/julia_loader.cpp"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
        "/opt/julia/include/julia"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "defines": [
        "NAPI_DISABLE_CPP_EXCEPTIONS",
        "JULIA_LIB_PATH=\"/opt/julia/lib/libjulia.so\""
      ]
    },
    {
      "target_name": "nutrimatic",
      "copies": [
        {
          "destination": "build/nutrimatic_src",
          "files": [
            "/opt/nutrimatic/expr-anagram.cpp",
            "/opt/nutrimatic/expr-filter.cpp",
            "/opt/nutrimatic/expr-intersect.cpp",
            "/opt/nutrimatic/expr-optimize.cpp",
            "/opt/nutrimatic/expr-parse.cpp",
            "/opt/nutrimatic/index-reader.cpp",
            "/opt/nutrimatic/index-walker.cpp",
            "/opt/nutrimatic/search-driver.cpp"
          ]
        }
      ],
      "sources": [
        "build/nutrimatic_src/expr-anagram.cpp",
        "build/nutrimatic_src/expr-filter.cpp",
        "build/nutrimatic_src/expr-intersect.cpp",
        "build/nutrimatic_src/expr-optimize.cpp",
        "build/nutrimatic_src/expr-parse.cpp",
        "build/nutrimatic_src/index-reader.cpp",
        "build/nutrimatic_src/index-walker.cpp",
        "build/nutrimatic_src/search-driver.cpp",
        "src/server/lib/nutrimatic.cpp"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
        "/opt/nutrimatic"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "cflags": [
        "-std=c++11",
        "-g",
        "-O6",
        "-Wall",
        "-Werror",
        "-Wno-unused-local-typedefs",
        "-Wno-uninitialized",
        "-Wno-sign-compare",
        "-fexceptions"
      ],
      "cflags_cc": [
        "-std=c++11",
        "-g",
        "-O6",
        "-Wall",
        "-Werror",
        "-Wno-unused-local-typedefs",
        "-Wno-uninitialized",
        "-Wno-sign-compare",
        "-fexceptions"
      ],
      "libraries": [
        "-lfst",
        "-lpthread",
        "-ldl"
      ],
      "defines": [
        "NAPI_DISABLE_CPP_EXCEPTIONS"
      ]
    }
  ]
}
