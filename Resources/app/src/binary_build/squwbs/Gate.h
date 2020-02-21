/*
 ==============================================================================
 
 Gate.h
 Created: 4 Feb 2018 4:16:05pm
 Author:  cumbe
 
 ==============================================================================
 */

#pragma once

#include "../JuceLibraryCode/JuceHeader.h"

//==============================================================================
/*
 */
class Gate    : public Component
{
public:
    Gate():
    releaseTime(0.2),
    sr(44100),
    threshold(0.015),
    outputValue(0.0),
    gain(1.0),
    holdTime(1.0),
    attackTime(0.01)
    {
        set(44100.0);
    }
    
    ~Gate()
    {
    }
    
    
    double process(double inputValue){
        if(tick>int(hold)){
            if(threshold>(inputValue*inputValue)){
                gain*=release;
            }
            else{
                tick=0;
                gain*=attack;
            }
        }
        else{
            tick+=1;
            gain=1.0;
        }
        outputValue=inputValue*gain;
        return outputValue;
    }
    void set(float sampleRate){
        sr=sampleRate;
        releaseTime=0.3;
        attackTime=0.03;
        threshold=0.0000001;
        release=1.0-exp(-1.0/(releaseTime*sr));
        hold=holdTime*sr;
        //attack=1.0-exp(-1.0/(attackTime*sr));
        attack=1.0-exp(-1.0/1.0);
    }
    void setThreshold(double newThreshold){
        threshold=newThreshold;
    }
private:
    double threshold;
    double releaseTime;
    double sr;
    double release;
    double outputValue;
    double gain;
    int tick;
    double hold;
    double holdTime;
    double attack;
    double attackTime;
    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (Gate)
};

