// #include <napi.h>
// #include <stdio.h>

// typedef union{
//     int32_t i32;
//     float f;
// } u;

// static void ArrayConsumer(const int32_t* array, size_t length) {
//   for (size_t index = 0; index < length; index++) {
//     // printf("it's alive\n");  
//     u currentNum;
//     currentNum.i32=array[index];
//     double f = currentNum.f;
//     fprintf(stderr, "[%lu]%.18f\n", index, f);
//   }
//   printf("%lu\n",length);
//   for (size_t i = 0; i < length; i++) {
//       array[i]=0;
//   }
// }

// static Napi::Value AcceptArrayBuffer(const Napi::CallbackInfo& info) {
//   if (info.Length() != 1) {
//     Napi::Error::New(info.Env(), "Expected exactly one argument")
//         .ThrowAsJavaScriptException();
//     return info.Env().Undefined();
//   }
//   if (!info[0].IsArrayBuffer()) {
//     Napi::Error::New(info.Env(), "Expected an ArrayBuffer")
//         .ThrowAsJavaScriptException();
//     return info.Env().Undefined();
//   }

//   Napi::ArrayBuffer buf = info[0].As<Napi::ArrayBuffer>();

//   ArrayConsumer(reinterpret_cast<int32_t*>(buf.Data()),
//                 buf.ByteLength() / sizeof(int32_t));

//   return info.Env().Undefined();
// }

// static Napi::Object Init(Napi::Env env, Napi::Object exports) {
//   exports["AcceptArrayBuffer"] = Napi::Function::New(env, AcceptArrayBuffer);
//   return exports;
// }

// NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)
#include "spline.h"
// #include "libthreeBandEQ.a"
#include <napi.h>
#include <stdio.h>
#include <cmath>

typedef union{
    int32_t int32;
    float float32;
} u;

static Napi::Array ArrayConsumer(int32_t* array, int length, double sampleRate ,Napi::Array output) {
//   std::vector<double> X,Y;
  int down_sample_ratio=floor(sampleRate/8000);
  int truncated_length=int(floor((length-1)/down_sample_ratio))+1;
  //double original_left_ds [length];
  //double new_interp_left[length];
  u currentNum;
  std::vector<double> truncated_left(truncated_length), truncated_index(truncated_length);
  double max_value=0.0;
  tk::spline s_left;
  tk::spline s_right;
  for (int index = 0; index < length; index++) { 
        bool cond1=(index==length-1);
        bool cond2=(index%down_sample_ratio==0);
        
        if(cond1||cond2){
            currentNum.int32=array[index];
            double currentFloat = currentNum.float32;
            // printf("%f",f);
            if(abs(array[index])>max_value){
                max_value=abs(currentFloat);
            }
            truncated_left[index/down_sample_ratio]=currentFloat;
            if(cond1){
            // if(index==length-1){
                truncated_index[truncated_length-1]=(index/down_sample_ratio);
            }
            else{
                if(cond2){
                    truncated_index[index/down_sample_ratio]=(index/down_sample_ratio);
                    // original_left_ds[index/down_sample_ratio] = f;
                }
            }
        }
       
   }
   s_left.set_points(truncated_index,truncated_left);
   //s_right.set_points(truncated_index,new_right);
  //  for (int i =0; i<length; i++){
  //      new_interp_left[i]=(s_left(double(i)));
  //      //new_interp_right[i]=(s_right(double(i)));
  //   }
  for (double index =0; index<length; index++){
    // bool cond1=(index==length-1);
    // bool cond2=(index%down_sample_ratio==0);     
    // if(cond1||cond2){
    //   if(cond1){
    //     // new_interp_left[index]=truncated_index[truncated_length-1];
    //     output[index]=truncated_index[truncated_length-1];
    //   }
    //   else if(cond2){
    //     // new_interp_left[index]=truncated_index[index/down_sample_ratio];
    //     output[index]=truncated_index[index/down_sample_ratio];
    //   }
    // }
    // else{
      // new_interp_left[index]=s_left(double(index/down_sample_ratio));
      // printf("%.1f X %i = %.0f \n",double(index/down_sample_ratio),down_sample_ratio,index);
      output[index]=s_left(double(index/down_sample_ratio));
    // }
  }
    
    // for (int i=0; i<length; i+=1){
    //     if(i%down_sample_ratio==0){
    //         new_interp_left[i]=truncated_left[i/down_sample_ratio];
    //     }
    //     else{
    //         new_interp_left[i]=s_left(double(i));
    //     }
    // }
  // for (int index = 0; index < length; index++) {
   
  //   output[index]=new_interp_left[index];
  // }
 
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
//   printf("info[1] : %f",sampleRate);
  int length = buf.ByteLength() / sizeof(int32_t);
  Napi::Array company_array = Napi::Array::New(info.Env(), length);
  Napi::Array new_array=ArrayConsumer(reinterpret_cast<int32_t*>(buf.Data()),length,sampleRate,company_array);
//   return info.Env().Undefined();
    return new_array;
}

static Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports["AcceptArrayBuffer"] = Napi::Function::New(env, AcceptArrayBuffer);
  return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)