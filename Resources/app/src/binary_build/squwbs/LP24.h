
#include <math.h>
#define PI 3.14159265
//==============================================================================
/*
*/

class LP24  
{
public:
    LP24():
    cutoff(750.0),
    resonance(0.0),
    buf0(0.0),
    buf1(0.0),
    buf2(0.0),
    buf3(0.0)
    {
       calculateFeedbackAmount();
    }

    ~LP24()
    {
    }

    float process(float inputValue){
        buf0 += cutoff * (inputValue - buf0);
        buf1 += cutoff * (buf0 - buf1);
        buf2 += cutoff * (buf1 - buf2);
        buf3 += cutoff * (buf2 - buf3);
    return buf3;
    };
    void set(float newCutoff) {
        
        cutoff = 2*sin((PI)*newCutoff/sampleRate);
        calculateFeedbackAmount();
    };
    void setResonance(float newResonance){
        resonance = newResonance;
        calculateFeedbackAmount();
    };
    void setSampleRate(float sr){
        sampleRate=sr;
    };
private:
    float cutoff;
    float resonance;
    float feedbackAmount;
    void calculateFeedbackAmount() { 
        feedbackAmount = resonance + resonance/(1.0 - cutoff); 
    };
    float buf0;
    float buf1;
    float buf2;
    float buf3;
    float sampleRate;
};
