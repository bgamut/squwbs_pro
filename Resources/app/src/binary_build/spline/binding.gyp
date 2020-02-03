{
  "targets": [
    {
      "include_dirs": [
        "<!(node -e \"require('nan')\")",
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ],
      "target_name": "addon",
      "sources": [ "main.cpp" ]
    }
  ]
}