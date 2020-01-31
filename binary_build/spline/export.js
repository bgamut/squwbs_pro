function spline(int32arraybuffer,sampleRate){
    const AcceptArrayBuffer= require ('./build/Release/addon.node').AcceptArrayBuffer
    return AcceptArrayBuffer(int32arraybuffer,sampleRate)
}
module.exports={
    spline:function(int32arraybuffer,sampleRate){
        spline(int32arraybuffer,sampleRate)
    }
}