/*
  ==============================================================================

    Phaser.h
    Created: 4 Feb 2018 4:20:55pm
    Author:  cumbe

  ==============================================================================
*/

#pragma once

#include "../JuceLibraryCode/JuceHeader.h"
//==============================================================================
/*
*/
class Phaser    : public Component
{
public:
    Phaser():
    _fb( .38196601125f )
    , _lfoPhase( 0.f )
    , _depth( 1.f )
    , _zm1( 0.f )
    {
        Range( 2250.f, 22050.f, 44100.0);
        Rate( .5f, 44100.0 );
    }

    ~Phaser()
    {
    }
    void Range( float fMin, float fMax ,double SR){ // Hz
        _dmin = fMin / (SR/2.f);
        _dmax = fMax / (SR/2.f);
    }
    void Rate( float rate ,double SR){ // cps
        _lfoInc = 2.f * 3.14159f * (rate / SR);
    }
    void Feedback( float fb ){ // 0 -> <1.
        _fb = fb;
    }
    void Depth( float depth ){  // 0 -> 1.
        _depth = depth;
    }
    float Update( float inSamp ){
        //calculate and update phaser sweep lfo...
        float d  = _dmin + (_dmax-_dmin) * ((sin( _lfoPhase ) +
                                             1.f)/2.f);
        _lfoPhase += _lfoInc;
        if( _lfoPhase >= 3.14159f * 2.f )
            _lfoPhase -= 3.14159f * 2.f;
        
        //update filter coeffs
        for( int i=0; i<6; i++ )
            _alps[i].Delay( d );
        
        //calculate output
        float y =     _alps[0].Update(
                                      _alps[1].Update(
                                                      _alps[2].Update(
                                                                      _alps[3].Update(
                                                                                      _alps[4].Update(
                                                                                                      _alps[5].Update( inSamp + _zm1 * _fb ))))));
        _zm1 = y;
        
        return inSamp + y * _depth;
    }
    float _lfoPhase;


private:
    class AllpassDelay{
    public:
        AllpassDelay()
        : _a1( 0.f )
        , _zm1( 0.f )
        {}
        
        void Delay( float delay ){ //sample delay time
            _a1 = (1.f - delay) / (1.f + delay);
        }
        
        float Update( float inSamp ){
            float y = inSamp * -_a1 + _zm1;
            _zm1 = y * _a1 + inSamp;
            
            return y;
        }
    private:
        float _a1, _zm1;
    };
    AllpassDelay _alps[6];
    float _dmin, _dmax; //range
    float _fb; //feedback
    
    float _lfoInc;
    float _depth;
    
    float _zm1;
    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (Phaser)
};
