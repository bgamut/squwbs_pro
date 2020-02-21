

// NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)
#include <napi.h>
#include <stdio.h>
#include <math.h>
#include "Squwbs.h"
#include <cmath>

typedef union{
    int32_t int32;
    float float32;
} u;

static Napi::Object ArrayConsumer(int32_t* leftArray, int32_t* rightArray,int length, double sampleRate ,Napi::Array outLeft,Napi::Array outRight,Napi::Object output) {
  u currentNumLeft;
  u currentNumRight;
  // std::vector<float> left(length), right(length);
  std::vector<float> interleaved(length*2);
  double max_value=0.0;
  ThreeBandEQ processor;
  processor.setSampleRate(sampleRate);
  processor.match(0.0,0.0);
  for (int index = 0; index < length; index++) { 
    currentNumLeft.int32=leftArray[index];
    currentNumRight.int32=rightArray[index];
    processor.match(currentNumLeft.float32,currentNumRight.float32);
    outLeft[index]=processor.output[0];
    outRight[index]=processor.output[1];
  }
  // output.Set('left',outLeft);
  // output.Set('right',outRight);
  // output.Set('sampleRate',sampleRate);
  output.Set('1',outLeft);
  output.Set('2',outRight);
  output.Set('3',sampleRate);

  
  return output;
}
// static Napi::Array ArrayConsumer(int32_t* leftArray, int32_t* rightArray,int length, double sampleRate ,Napi::Array output) {
//   u currentNumLeft;
//   u currentNumRight;
//   // std::vector<float> left(length), right(length);
//   std::vector<float> interleaved(length*2);
//   double max_value=0.0;
//   ThreeBandEQ processor;
//   processor.setSampleRate(sampleRate);
//   processor.match(0.0,0.0);
//   for (int index = 0; index < length; index++) { 
//     currentNumLeft.int32=leftArray[index];
//     currentNumRight.int32=rightArray[index];
//     processor.match(currentNumLeft.float32,currentNumRight.float32);
//     output[index*2]=processor.output[0];
//     output[index*2+1]=processor.output[1];
//   }
//   return output;
// }

// static Napi::Array ArrayConsumer(int32_t* interLeaveArray,int length, double sampleRate ,Napi::Array output) {
//   u currentNum;
//   float left=0.0;
//   float right=0.0;
//   std::vector<float> interLeaveArray(length);
//   double max_value=0.0;
//   ThreeBandEQ processor;
//   processor.setSampleRate(sampleRate);
//   for (int index = 0; index < length; index++) { 
//     // currentNumLeft.int32=leftArray[index];
//     // currentNumRight.int32=rightArray[index];
//     currentNum.int32=interLeaveArray[index*2];
//     left = currentNum.float32;
//     currentNum.int32=interLeaveArray[index*2+1];
//     left = currentNum.float32;
//     processor.match(currentNumLeft.float32,currentNumRight.float32);
//     output[index*2]=processor.output[0];
//     output[index*2+1]=processor.output[1];
//   }
//   return output;
// }

static Napi::Value AcceptArrayBuffer(const Napi::CallbackInfo& info) {
  // if (info.Length() != 3) {
  //   Napi::Error::New(info.Env(), "Expects three arguments")
  //       .ThrowAsJavaScriptException();
  //   return info.Env().Undefined();
  // }
  // if (!info[0].IsArrayBuffer()) {
  //   Napi::Error::New(info.Env(), "Expected an ArrayBuffer")
  //       .ThrowAsJavaScriptException();
  //   return info.Env().Undefined();
  // }
  //  if (!info[1].IsArrayBuffer()) {
  //   Napi::Error::New(info.Env(), "Expected an ArrayBuffer")
  //       .ThrowAsJavaScriptException();
  //   return info.Env().Undefined();
  // }
  // if (!info[2].IsNumber()){
  //   Napi::Error::New(info.Env(), "Expected an Number")
  //       .ThrowAsJavaScriptException();
  //   return info.Env().Undefined();
  // }

  Napi::ArrayBuffer bufLeft = info[0].As<Napi::ArrayBuffer>();
  Napi::ArrayBuffer bufRight = info[1].As<Napi::ArrayBuffer>();
  double sampleRate=double(info[2].As<Napi::Number>());
  int length = bufLeft.ByteLength() / sizeof(int32_t);
  Napi::Array output_left = Napi::Array::New(info.Env(), length);
  Napi::Array output_right = Napi::Array::New(info.Env(), length);
  Napi::Object output = Napi::Object::New(info.Env());
  Napi::String outputKeySF = Napi::String::New(info.Env(),"sampleRate");
  Napi::String outputKeyLeft = Napi::String::New(info.Env(),"left");
  Napi::String outputKeyRight = Napi::String::New(info.Env(),"right");
  

  // Napi::Array new_array=ArrayConsumer(reinterpret_cast<int32_t*>(bufLeft.Data()),reinterpret_cast<int32_t*>(bufRight.Data()),length,sampleRate,company_array);
  //   return new_array;
  Napi::Object company_object = ArrayConsumer(reinterpret_cast<int32_t*>(bufLeft.Data()),reinterpret_cast<int32_t*>(bufRight.Data()),length,sampleRate,output_left,output_right,output);
    return company_object;
}
static Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports["AcceptArrayBuffer"] = Napi::Function::New(env, AcceptArrayBuffer);
  return exports;
}
NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)