{
  "targets": [
    {
      "include_dirs": [
        "<!(node -e \"require('nan')\")",
        "<!@(node -p \"require('node-addon-api').include\")",
        "include",
        "/usr/local/Cellar/fftw/3.3.8_1/include"
      ],
      'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ],
      "target_name": "addon",
      "sources": [ "main.cpp" ]
    }
  ]
}