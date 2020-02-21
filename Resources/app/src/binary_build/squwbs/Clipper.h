/*
  ==============================================================================

    Clipper(2).h
    Created: 4 Feb 2018 3:10:34pm
    Author:  cumbe

  ==============================================================================
*/

#pragma once

#include "../JuceLibraryCode/JuceHeader.h"

//==============================================================================
/*
*/
class Clipper    : public Component
{
public:
    Clipper()
    {
        // In your constructor, you should add any child components, and
        // initialise any special settings that your component needs.

    }

    ~Clipper()
    {
    }


    float process(float inputValue) {
		k=atanf(inputValue*0.5)/atanf(1.0);
		float i = atanf(powf(abs(inputValue), 100));
		//k = sign(inputValue)*powf(i, (1.0 / 100.0));
		return k;
	}

private:
    float k;
	float sign(float a) {
		if (a < 0) {
			return (-1.0);
		}
		else {
			return (1.0);
		}
	};
    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (Clipper)
};
