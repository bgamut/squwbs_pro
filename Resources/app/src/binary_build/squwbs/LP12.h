/*
  ==============================================================================

    LP12.h
    Created: 4 Feb 2018 2:57:51pm
    Author:  cumbe

  ==============================================================================
*/

#pragma once

#include "../JuceLibraryCode/JuceHeader.h"
#include "math.h"
#define PI 3.14159265

//==============================================================================
/*
*/
class LP12    : public Component
{
public:
    LP12():
    cutoff(750.0),
    resonance(0.0),
    buf0(0.0),
    buf1(0.0),
    sampleRate(44100.0)
    {
       calculateFeedbackAmount();
    }

    ~LP12()
    {
    }


    float process(float inputValue){
        buf0 += cutoff * (inputValue - buf0);
        buf1 += cutoff * (buf0 - buf1);
        return buf1; 
    };

    void set(float newCutoff){
        cutoff = 2*sin((PI)*newCutoff/sampleRate); 
        calculateFeedbackAmount();
    };
    void setResonance(float newResonance){
        resonance = newResonance; calculateFeedbackAmount();
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
    float sampleRate;
    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (LP12)
};
