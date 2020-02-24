/*
  ==============================================================================

    ThreeBandEQ.h
    Created: 7 Feb 2018 4:29:39pm
    Author:  cumbe

  ==============================================================================
*/

#pragma once

#include <math.h>
class Notch12 
{
public:
    Notch12():
    cutoff(2750.0),
    resonance(0.000001),
    buf0(0.0),
    buf1(0.0),
    sampleRate(44100)
    {
        calculateFeedbackAmount();
    }

    ~Notch12()
    {
    }
    float process(float inputValue){
        buf0 += cutoff * (inputValue - buf0);
        buf1 += cutoff * (buf0 - buf1);
        return inputValue - (buf0 - buf1);
    }
        
    void set(float newCutoff) { 
        cutoff = 2*sin((M_PI)*newCutoff/sampleRate);
        calculateFeedbackAmount(); 
    }
    void setResonance(float newResonance) { 
        resonance = newResonance; calculateFeedbackAmount(); 
    }
    void setSampleRate(float sr){
        sampleRate=sr;
    }
private:
	float cutoff;
	float resonance;
	float buf0;
	float buf1;
	float sampleRate;
	float feedbackAmount;
	void calculateFeedbackAmount() {
		feedbackAmount = resonance + resonance / (1.0 - cutoff);
	};
    
};
class Clipper
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
    
};

class Gate 
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
    
};

class Phaser   
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
    
};

class HP12   
{
public:
    HP12():
    cutoff(750.0),
    resonance(0.0),
    buf0(0.0),
    buf1(0.0),
	sampleRate(44100.0)
    {
        calculateFeedbackAmount();
    }

    ~HP12()
    {
    }

    float process(float inputValue){
        buf0 += cutoff * (inputValue - buf0 + feedbackAmount * (buf0 - buf1));
        //buf0 += cutoff * (inputValue - buf0);
        buf1 += cutoff * (buf0 - buf1);
        return inputValue - buf1;
    }
    void set(float newCutoff) {
        
        cutoff = 2*sin((M_PI)*newCutoff/sampleRate);
        calculateFeedbackAmount();
    }
    void setResonance(float newResonance){
        resonance = newResonance;
        calculateFeedbackAmount();
    }
    void setSampleRate(float sr){
        sampleRate=sr;
    }
private:
    float cutoff;
    float resonance;
    float feedbackAmount;
    void calculateFeedbackAmount() { 
        feedbackAmount = resonance + resonance/(1.0 - cutoff); 
    }
	float sampleRate;
    float buf0;
    float buf1;
    
};
class LP12   
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
        cutoff = 2*sin((M_PI)*newCutoff/sampleRate); 
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
    
};

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
        
        cutoff = 2*sin((M_PI)*newCutoff/sampleRate);
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

class ThreeBandEQ   
{
public:
    ThreeBandEQ()
	{
        setSampleRate(44100);
        setGains(1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0);
        setRatios(1.0, 1.0, 1.0, 1.0, 1.0, 1.0);
        setMidHP(20.0);
        setSideHP(200.0);
        setMidLMC(175.0);
        setSideLMC(175.0);
        setMidMHC(2750.0);
        setSideMHC(2750.0);
        setMidLP(2250.0);
        setSideLP(6000.0);
        resetMatch();
        reset();
        //below is the data from eot
        setGoals(0.068,0.031,0.039,0.043,0.035,0.038,0.031,0.031,0.031,0.063,0.063,0.063);   
	}
    ~ThreeBandEQ()
    {
    }
void setMidHP(float freq) {
	midHP.set(freq);
}
void setSideHP(float freq) {
	leftHP.set(freq);
	rightHP.set(freq);
}
void setMidLP(float freq) {
	midLP.set(freq);
}
void setSideLP(float freq) {
	leftLP.set(freq);
	rightLP.set(freq);
}
void setMidLMC(float freq){
    midLPL.set(freq);
    midHPM.set(freq);
}
void setSideLMC(float freq){
    leftLPL.set(freq);
    rightLPL.set(freq);
    leftHPM.set(freq);
    rightHPM.set(freq);
}
void setMidMHC(float freq){
    midLPM.set(freq);
    midHPH.set(freq);
}
void setSideMHC(float freq){
    leftLPM1.set(freq);
    leftLPM2.set(freq);
    rightLPM1.set(freq);
    rightLPM2.set(freq);
    leftHPH.set(freq);
    rightHPH.set(freq);
}
float mid(float left, float right){
    return (left+right)/2.0;
}
float leftOnly(float left, float right){
    return left-mid(left,right);
}
float rightOnly(float left, float right){
    return right-mid(left,right);
}
void reset() {
	leftlowtmp = 0;
	leftmidtmp = 0;
	lefthightmp = 0;
	midlowtmp = 0;
	midmidtmp = 0;
	midhightmp = 0;
	rightlowtmp = 0;
	rightmidtmp = 0;
	righthightmp = 0;
	sidelowrms = 0;
	sidemidrms = 0;
	sidehighrms = 0;
	midlowrms = 0;
	midmidrms = 0;
	midhighrms = 0;
	sidelowsd = 0;
	sidemidsd = 0;
	sidehighsd = 0;
	m=0;
	l = 0;
	r = 0;
	midh = 0;
	midm = 0;
	midl = 0;
	lefth = 0;
	leftm = 0;
	leftl = 0;
	righth = 0;
	rightm = 0;
	rightl = 0;
	plhrms = 0;
	plmrms = 0;
	pllrms = 0;
	pmhrms = 0;
	pmmrms = 0;
	pmlrms = 0;
	prhrms = 0;
	prmrms = 0;
	prlrms = 0;
	plhsd = 0;
	plmsd = 0;
	pllsd = 0;
	pmhsd = 0;
	pmmsd = 0;
	pmlsd = 0;
	prhsd = 0;
	prmsd = 0;
	prlsd = 0;
	for (int i = 0; i < 8; i++) {
		processlefthigh[i] = 0.0;
		processleftmid[i] = 0.0;
		processleftlow[i] = 0.0;
		processmidhigh[i] = 0.0;
		processmidmid[i] = 0.0;
		processmidlow[i] = 0.0;
		processrighthigh[i] = 0.0;
		processrightmid[i] = 0.0;
		processrightlow[i] = 0.0;
	};
	index = 0;
}
void setGains(float m, float s,float hm,float mm, float lm, float hs, float ms, float ls){
    midGain=m;
    sideGain=s;
    highMidGain=hm;
    midMidGain=mm;
    lowMidGain=lm;
    highSideGain=hs;
    midSideGain=ms;
    lowSideGain=ls;
}
void setRatios(float hm, float mm, float lm, float hs, float ms, float ls) {
	highMidRatio=1.0;
	highSideRatio=1.0;
	midMidRatio=1.0;
	midSideRatio=1.0;
	lowMidRatio=1.0;
	lowSideRatio=1.0;
}
void setSampleRate(float sr){
    leftLPL.setSampleRate(sr);
	rightLPL.setSampleRate(sr);
	midLPL.setSampleRate(sr);
	leftLPM1.setSampleRate(sr);
    leftLPM2.setSampleRate(sr);
    rightLPM1.setSampleRate(sr);
    rightLPM2.setSampleRate(sr);
	midLPM.setSampleRate(sr);
	leftLP.setSampleRate(sr);
	rightLP.setSampleRate(sr);
	midLP.setSampleRate(sr);
	leftHPM.setSampleRate(sr);
	rightHPM.setSampleRate(sr);
	midHPM.setSampleRate(sr);
	leftHPH.setSampleRate(sr);
	rightHPH.setSampleRate(sr);
	midHPH.setSampleRate(sr);
	phaser1.Rate(0.002, sr);
	phaser2.Rate(0.002, sr);
    gate1.set(sr);
    gate2.set(sr);
    gate3.set(sr);
    clearerOne.setSampleRate(sr);
    clearerTwo.setSampleRate(sr);
}
void runStats(float* left, float*right, int length) {
	for (int i=0; i<length; i++){
		m = midHP.process(midLP.process(mid(left[i], right[i])));
		l = leftHP.process(leftOnly(left[i], right[i]));
		r = rightHP.process(rightOnly(left[i], right[i]));
		midh = midHPH.process(m);
		midm = midHPM.process(midLPM.process(m));
		midl = midLPL.process((m));
		lefth = leftHPH.process(l);
		leftm = leftHPM.process(leftLPM1.process(l));
		leftl = leftLPL.process((l));
		righth = rightHPH.process(r);
		rightm = rightHPM.process(rightLPM1.process(r));
		rightl = rightLPL.process((r));
		sidehighrms += (abs(lefth)+abs(righth)) / (2.0*length);
		sidemidrms += (abs(leftm)+abs(rightm)) / (2.0*length);
		sidelowrms += (abs(leftl)+abs(rightl)) / (2.0*length);
		midhighrms += (abs(midh) / length);
		midmidrms += (abs(midm) / length);
		midlowrms += (abs(midl) / length);
        maximum = fmax(fabs(left[i]),fabs(right[i]));
	}
	for (int i = 0; i < length; i++) {
		sidehighsd += abs(abs(lefth) + abs(righth) - (2 * sidehighrms)) / (2.0*length);
		sidemidsd += abs(abs(leftm) + abs(rightm) - (2 * sidemidrms)) / (2.0*length);
		sidelowsd += abs(abs(leftl) + abs(rightl) - (2 * sidelowrms)) / (2.0*length);
		midhighsd += abs(abs(midh) - sidehighrms) / length;
		midmidsd += abs(abs(midm) - midmidrms) / length;
		midlowsd += abs(abs(midl) - midlowrms) / length;
	};
};
void setGoals(float gmhrms, float gmmrms, float gmlrms, float gshrms, float gsmrms, float gslrms, float gmhsd, float gmmsd, float gmlsd, float gshsd, float gsmsd, float gslsd ) {
	midhighrms = gmhrms;
	midmidrms = gmmrms;
	midlowrms = gmlrms;
	sidehighrms = gshrms;
	sidemidrms = gsmrms;
	sidelowrms = gslrms;
	midhighsd = gmhsd;
	midmidsd = gmmsd;
	midlowsd = gmlsd;
	sidehighsd = gshsd;
	sidemidsd = gsmsd;
	sidelowsd = gslsd;
}
float* match(float left, float right) {
    l = leftHP.process(leftOnly(left, right));
    m = midHP.process(midLP.process(mid(left, right)));
    r = rightHP.process(rightOnly(left, right));
    lefth = leftHPH.process(l);
    leftm = leftHPM.process(leftLPM1.process(l));
    leftl = leftLPL.process(l);
    midh = midHPH.process(m);
    midm = midHPM.process(midLPM.process(m));
    midl = midLPL.process(m);
    righth = rightHPH.process(r);
    rightm = rightHPM.process(rightLPM1.process(r));
    rightl = rightLPL.process(r);
	if(index<8){
		processlefthigh[index] = lefth;
		processleftmid[index] = leftm;
		processleftlow[index] = leftl;
		processmidhigh[index] = midh;
		processmidmid[index] = midm;
		processmidlow[index] = midl;
		processrighthigh[index] = righth;
		processrightmid[index] = rightm;
		processrightlow[index] = rightl;
		plhrms += abs(lefth) / 8.0;
		plmrms += abs(leftm) / 8.0;
		pllrms += abs(leftl) / 8.0;
		pmhrms += abs(midh) / 8.0;
		pmmrms += abs(midm) / 8.0;
		pmlrms += abs(midl) / 8.0;
		prhrms += abs(righth) / 8.0;
		prmrms += abs(rightm) / 8.0;
		prlrms += abs(rightl) / 8.0;
		index++;
	}
	else {
		for (int i = 0; i < 8; i++) {
			plhsd += abs(processlefthigh[i] - plhrms) / 8.0;
			plmsd += abs(processleftmid[i] - plmrms) / 8.0;
			pllsd += abs(processleftlow[i] - pllrms) / 8.0;
			pmhsd += abs(processmidhigh[i] - pmhrms) / 8.0;
			pmmsd += abs(processmidmid[i] - pmmrms) / 8.0;
			pmlsd += abs(processmidlow[i] - pmlrms) / 8.0;
			prhsd += abs(processrighthigh[i] - prhrms) / 8.0;
			prmsd += abs(processrightmid[i] - prmrms) / 8.0;
			prlsd += abs(processrightlow[i] - prlrms) / 8.0;
		}
    }
    setGains(1.0, 0.25, midhighsd / pmhsd, midmidsd / pmmsd, midlowsd / pmlsd, sidehighsd / (plhsd / 2.0 + prhsd / 2.0), sidemidsd / (plmsd / 2.0 + prmsd / 2.0), sidelowsd / (pllsd / 2.0 + prlsd / 2.0));
    midh = matchBox(midh, pmhrms, midhighrms, midhighsd, pmhsd);
    midm = matchBox(midm, pmmrms, midmidrms, midmidsd, pmmsd);
    midl = matchBox(midl, pmlrms, midlowrms, midlowsd, pmlsd);
    lefth = matchBox(lefth, plhrms, sidehighrms, sidehighsd, plhsd);
    leftm = matchBox(leftm, plmrms, sidemidrms, sidemidsd, plmsd);
    leftl = matchBox(leftl, pllrms, sidelowrms, sidelowsd, pllsd);
    righth = matchBox(righth, prhrms, sidehighrms, sidehighsd, prhsd);
    rightm = matchBox(rightm, prmrms, sidemidrms, sidemidsd, prmsd);
    rightl = matchBox(rightl, prlrms, sidelowrms, sidelowsd, prlsd);
    resetMatch(); 
	output[0] = sin(M_PI/2.0*(highMidGain*(midh) + midMidGain * (midm) + lowMidGain * (midl))*midGain + (highSideGain * (lefth) + midSideGain * (leftm) + lowSideGain * (leftl))*sideGain);
	output[1] = sin(M_PI/2.0*(highMidGain*(midh) + midMidGain * (midm) + lowMidGain * (midl))*midGain + (highSideGain * (righth) + midSideGain * (rightm) + lowSideGain * (rightl))*sideGain);

	return output;
};
void resetMatch() {
    for (int i=0; i<8; i++){
        processlefthigh[i] = 0.0;
        processleftmid[i] = 0.0;
        processleftlow[i] = 0.0;
        processmidhigh[i] = 0.0;
        processmidmid[i] = 0.0;
        processmidlow[i] = 0.0;
        processrighthigh[i] = 0.0;
        processrightmid[i] = 0.0;
        processrightlow[i] = 0.0;
    }
        plhrms = 0.5;
        plmrms = 0.5;
        pllrms = 0.5;
        pmhrms = 0.5;
        pmmrms = 0.5;
        pmlrms = 0.5;
        prhrms = 0.5;
        prmrms = 0.5;
        prlrms = 0.5;
        plhsd = 0.25;
        plmsd = 0.25;
        pllsd = 0.25;
        pmhsd = 0.25;
        pmmsd = 0.25;
        pmlsd = 0.25;
        prhsd = 0.25;
        prmsd = 0.25;
        prlsd = 0.25;
        index = 0;
    }
float matchBox(float input, float originalRms, float targetRms, float sd1, float sd2) {
    if(targetRms>originalRms){
        if(input>0.0){
            return input-originalRms*sd1/sd2+targetRms;
        }
        else if(input<0.0){
            return input+originalRms*sd1/sd2-targetRms;
        }

        else{
            return input;
        }
    }
    else if(targetRms<originalRms){
        if(input>originalRms){
            return input-originalRms*sd1/sd2+targetRms;
        }
        else if(input<(-1.0)*(originalRms)){
            return input+originalRms*sd1/sd2-targetRms;
        }
        else{
            return input;
        }
    }
    else{
        return input;
    }
}
    float midGain;
    float sideGain;
    float midLMC;
    float sideLMC;
    float midMHC;
    float sideMHC;
    float midLPF;
    float sideLPF;
	float m;
	float l;
	float r;
	float midh;
	float midm;
	float midl;
	float lefth;
	float leftm;
	float leftl;
	float righth;
	float rightm;
	float rightl;
	float highMidGain;
	float highSideGain;
	float midMidGain;
	float midSideGain;
	float lowMidGain;
	float lowSideGain;
	float highMidRatio;
	float highSideRatio;
	float midMidRatio;
	float midSideRatio;
	float lowMidRatio;
	float lowSideRatio;
	float output[2];
	float leftlowtmp;
	float leftmidtmp;
	float lefthightmp;
	float midlowtmp;
	float midmidtmp;
	float midhightmp;
	float rightlowtmp;
	float rightmidtmp;
	float righthightmp;
	float sidelowrms;
	float sidemidrms;
	float sidehighrms;
	float midlowrms;
	float midmidrms;
	float midhighrms;
	float sidelowsd;
	float sidemidsd;
	float sidehighsd;
	float midlowsd;
	float midmidsd;
	float midhighsd;
	float processlefthigh[8];
	float processleftmid[8];
	float processleftlow[8];
	float processmidhigh[8];
	float processmidmid[8];
	float processmidlow[8];
	float processrighthigh[8];
	float processrightmid[8];
	float processrightlow[8];
	float plhrms;
	float plmrms;
	float pllrms;
	float pmhrms;
	float pmmrms;
	float pmlrms;
	float prhrms;
	float prmrms;
	float prlrms;
	float plhsd;
	float plmsd;
	float pllsd;
	float pmhsd;
	float pmmsd;
	float pmlsd;
	float prhsd;
	float prmsd;
	float prlsd;
    float maximum;
	int index;
private:
    LP12 leftLPL;
	LP12 rightLPL;
	LP12 midLPL;
	LP12 leftLPM1;
    LP12 leftLPM2;
    LP12 rightLPM1;
    LP12 rightLPM2;
	LP12 midLPM;
	LP12 leftLP;
	LP12 rightLP;
	LP24 midLP;
	HP12 midHP;
	HP12 leftHP;
	HP12 rightHP;
	HP12 leftHPM;
	HP12 rightHPM;
	HP12 midHPM;
	HP12 leftHPH;
	HP12 rightHPH;
	HP12 midHPH;
    Notch12 clearerOne;
    Notch12 clearerTwo;
	Gate gate1;
	Gate gate2;
    Gate gate3;
	Phaser phaser1;
	Phaser phaser2;
	Clipper clipper1;
	Clipper clipper2;
    
};
