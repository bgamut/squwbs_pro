#include <napi.h>
#include <stdio.h>
#include <cmath>
#include <memory.h>
#include <iostream>
#include <fstream>
#include <cstdlib>
#include <math.h>
#include <complex>
#include <valarray>
// #include "include/gaborator/gaborator.h"
// #include "include/gaborator/render.h"
// #include "fftw3.h"
// #include "kissfft-master/kiss_fft.h"
const double PI=3.141592653589793238460;
typedef std::complex<double> Complex;
typedef std::valarray<Complex> CArray;
typedef union{
    int32_t int32;
    float float32;
} u;

void fft(CArray& x){
  const size_t N=x.size();
  if(N<=1) return;
  CArray even = x[std::slice(0,N/2,2)];
  CArray odd= x[std::slice(1,N/2,2)];
  fft(even);
  fft(odd);
  for(size_t k=0; k<N/2; ++k)
  {
    Complex t = std::polar(1.0, -2 * PI * k / N) * odd[k];
    x[k    ] = even[k] + t;
    x[k+N/2] = even[k] - t;
  }
}
// void fft(CArray &x)
// {
// 	// DFT
// 	unsigned int N = x.size(), k = N, n;
// 	double thetaT = 3.14159265358979323846264338328L / N;
// 	Complex phiT = Complex(cos(thetaT), -sin(thetaT)), T;
// 	while (k > 1)
// 	{
// 		n = k;
// 		k >>= 1;
// 		phiT = phiT * phiT;
// 		T = 1.0L;
// 		for (unsigned int l = 0; l < k; l++)
// 		{
// 			for (unsigned int a = l; a < N; a += n)
// 			{
// 				unsigned int b = a + k;
// 				Complex t = x[a] - x[b];
// 				x[a] += x[b];
// 				x[b] = t * T;
// 			}
// 			T *= phiT;
// 		}
// 	}
// 	// Decimate
// 	unsigned int m = (unsigned int)log2(N);
// 	for (unsigned int a = 0; a < N; a++)
// 	{
// 		unsigned int b = a;
// 		// Reverse bits
// 		b = (((b & 0xaaaaaaaa) >> 1) | ((b & 0x55555555) << 1));
// 		b = (((b & 0xcccccccc) >> 2) | ((b & 0x33333333) << 2));
// 		b = (((b & 0xf0f0f0f0) >> 4) | ((b & 0x0f0f0f0f) << 4));
// 		b = (((b & 0xff00ff00) >> 8) | ((b & 0x00ff00ff) << 8));
// 		b = ((b >> 16) | (b << 16)) >> (32 - m);
// 		if (b > a)
// 		{
// 			Complex t = x[a];
// 			x[a] = x[b];
// 			x[b] = t;
// 		}
// 	}
// 	//// Normalize (This section make it not working correctly)
// 	//Complex f = 1.0 / sqrt(N);
// 	//for (unsigned int i = 0; i < N; i++)
// 	//	x[i] *= f;
// }
void ifft(CArray& x)
{
    // conjugate the complex numbers
    x = x.apply(std::conj);
 
    // forward fft
    fft( x );
 
    // conjugate the complex numbers again
    x = x.apply(std::conj);
 
    // scale the numbers
    x /= x.size();
}
static Napi::Array ArrayConsumer(int32_t* array, int length, double sampleRate ,Napi::Array output) {
    // std::vector<float> left(length);
    Complex left[length];
    u currentNum;

    for (int i = 0; i < length; i++) {
        currentNum.int32=array[i];
        left[i]=currentNum.float32;
    }
    CArray data(left,length);
    fft(data);
    double max=1;
    double temp[length];
    for(int i=0; i<length; i++){
      //double currentNumber =double(pow((pow(data[i].real(),2)+pow(data[i].imag(),2)),1/2));
      // temp[i]=currentNumber;
      double currentNumber = pow((pow(data[i].real(),2)+pow(data[i].imag(),2)),0.5);
      temp[i]=currentNumber;
      // output[i]=currentNumber;
      if(max<currentNumber){
        max=currentNumber;
      }
    }
    for(int i=0; i<length; i++){
      output[i]=temp[i]/max;
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