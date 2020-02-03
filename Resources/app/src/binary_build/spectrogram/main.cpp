#include <napi.h>
#include <stdio.h>
#include <cmath>
#include <memory.h>
#include <iostream>
#include <fstream>
#include <cstdlib>
#include "include/gaborator/gaborator.h"
#include "include/gaborator/render.h"

typedef union{
    int32_t int32;
    float float32;
} u;

static Napi::Array ArrayConsumer(int32_t* array, int length, double sampleRate ,Napi::Array output) {
    std::vector<float> left(length);
    u currentNum;
    for (int i = 0; i < length; i++) {
        currentNum.int32=array[i];
        left[i]=currentNum.float32;
    }
    gaborator::parameters params(48, 20.0/44100, 440.0/44100);
    gaborator::analyzer<float> analyzer(params);
    gaborator::coefs<float> coefs(analyzer);
    analyzer.analyze(left.data(),0,left.size(),coefs);
    int64_t x_origin=0;
    int64_t y_origin = analyzer.bandpass_bands_begin();
    int x_scale_exp=10;
    int y_scale_exp=0;
    while((length>>x_scale_exp)>1000){
        x_scale_exp++;
    }
    int64_t x0=0;
    int64_t y0=0;
    int64_t x1=length>>x_scale_exp;
    int64_t y1 = (analyzer.bandpass_bands_end()-analyzer.bandpass_bands_begin())>>y_scale_exp;
    std::vector<float> amplitudes((x1-x0)*(y1-y0));
    gaborator::render_p2scale(
                              analyzer,
                              coefs,
                              x_origin,y_origin,
                              x0,x1,x_scale_exp,
                              y0,y1,y_scale_exp,
                              amplitudes.data()
                              );
    for(int i=0; i<amplitudes.size(); i++){
       output[i]=double(amplitudes[i]);
    }
    return output;
}
static Napi::Value AcceptArrayBuffer(const Napi::CallbackInfo& info) {
  if (info.Length() != 2) {
    Napi::Error::New(info.Env(), "Expects two arguments")
        .ThrowAsJavaScriptException();
    return info.Env().Undefined();
  }
  if (!info[0].IsArrayBuffer()) {
    Napi::Error::New(info.Env(), "Expected an ArrayBuffer")
        .ThrowAsJavaScriptException();
    return info.Env().Undefined();
  }
  if (!info[1].IsNumber()){
    Napi::Error::New(info.Env(), "Expected an Number")
        .ThrowAsJavaScriptException();
    return info.Env().Undefined();
  }
  Napi::ArrayBuffer buf = info[0].As<Napi::ArrayBuffer>();
  double sampleRate=double(info[1].As<Napi::Number>());
  int length = buf.ByteLength() / sizeof(int32_t);
  Napi::Array company_array = Napi::Array::New(info.Env(), length);
  Napi::Array new_array=ArrayConsumer(reinterpret_cast<int32_t*>(buf.Data()),length,sampleRate,company_array);
    return new_array;
}

static Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports["AcceptArrayBuffer"] = Napi::Function::New(env, AcceptArrayBuffer);
  return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)