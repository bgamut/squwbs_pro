function squwbs(bufferLeft,bufferRight,sampleRate){
    const AcceptArrayBuffer= require ('./build/Release/squwbs.node').AcceptArrayBuffer
    var Float32Left = new Float32Array(bufferLeft);
    var Float32Right = new Float32Array(bufferRight);
    var Int32Left = new Int32Array(Float32Left.buffer);
    var Int32Right = new Int32Array(Float32Right.buffer);
    var object = AcceptArrayBuffer(Int32Left.buffer,Int32Right.buffer,sampleRate)
    var keyArray=['left','right','sampleRate']
    var tempObject = {}
    Object.keys(object).forEach(function(key,index){
        tempObject[keyArray[index]]=object[key]
    })
    var max = 0;
    var leftTrimPointDetected = false
    var rightTrimPointDectected = false
    var leftTrimPoint=0
    var rightTrimPoint=0
    for (var i = 0 ; i<tempObject.left.length; i++){
        var leftAbs=Math.abs(tempObject.left[i])
        var rightAbs=Math.abs(tempObject.right[i])
        if(leftTrimPointDetected==false){
            if (leftAbs>0.0025){
                leftTrimPoint=i
                leftTrimPointDetected=true
            }
        }
        if(rightTrimPointDectected==false){
            if (rightAbs>0.0025){
                rightTrimPoint=i
                rightTrimPointDetected=true
            }
        }
        if(max<leftAbs){
            max=leftAbs
        }
        if(max<rightAbs){
            max=rightAbs
        }
    }
    
    for (var i = 0 ; i<tempObject.left.length; i++){
        tempObject.left[i]=(tempObject.left[i]/max)*0.95
        tempObject.right[i]=(tempObject.right[i]/max)*0.95
    }
    var newStartIndex=Math.min(leftTrimPoint,rightTrimPoint)
    var newObject ={left:[],right:[],sampleRate:0}
    for (var i = newStartIndex ; i<tempObject.left.length; i++){
        newObject.left[i-newStartIndex]=(tempObject.left[i])
        newObject.right[i-newStartIndex]=(tempObject.right[i])
    }

    return newObject
}
exports.squwbs=squwbs
 