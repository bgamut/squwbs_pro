var fs = require('fs');
var path = require('path');
const desktopPath = require('path').join(require('os').homedir(), 'Desktop')
var fullPathDirectory=path.join(desktopPath,'mastered_files')
var newFileList=fs.readdirSync(fullPathDirectory)
// console.log(newFileList)
var bagOfWords=[]
var newBagOfWords={}
for (index in newFileList){
    var tempFileNameSplit1=newFileList[index].split('_')
    for(secIndex in tempFileNameSplit1){
        var tempFileNameSplit2=tempFileNameSplit1[secIndex].split(' ')
        for(thirdIndex in tempFileNameSplit2){
            var tempFileNameSplit3=tempFileNameSplit1[secIndex].split('.')
        }
            for(index4 in tempFileNameSplit3){
                // bagOfWords.push(tempFileNameSplit3[index4])
                bagOfWords.push(tempFileNameSplit3[index4].toLowerCase())
            }
            
    }
}
bagOfWords.sort()
for (index in bagOfWords){
    if(isNaN(bagOfWords[index])==true){
        if(bagOfWords[index]!='mp3'){
            if(newBagOfWords[String(bagOfWords[index])]==undefined){
                newBagOfWords[String(bagOfWords[index])]=1
            }
            else{
                newBagOfWords[String(bagOfWords[index])]+=1
            }
        }
    }
}
finalBagOfWords=[]
for (entry in newBagOfWords){
    // console.log(entry)
    finalBagOfWords.push({name:entry,occurance:newBagOfWords[entry]})
}
byOccurance=finalBagOfWords.slice()
byOccurance.sort(function(a,b){
    return b.occurance-a.occurance
})
keysSorted = Object.keys(newBagOfWords).sort(function(a,b){return newBagOfWords[a]-newBagOfWords[b]})
console.log(byOccurance)

//oneshot
////drums
//////kick
//////snare
//////clap
//////hihat
//////perc
////synth
////bass
////pad
////vocal
//loop




// [
//     { name: 'oliver', occurance: 786 },
//     { name: 'shot', occurance: 404 },
//     { name: 'one', occurance: 403 },
//     { name: 'loop', occurance: 394 },
//     { name: 'kshmr', occurance: 389 },
//     { name: 'bass', occurance: 278 },
//     { name: 'kick', occurance: 278 },
//     { name: 'snare', occurance: 263 },
//     { name: 'wg', occurance: 259 },
//     { name: 'drum', occurance: 232 },
//     { name: 'c', occurance: 220 },
//     { name: 'fx', occurance: 177 },
//     { name: 'just', occurance: 175 },
//     { name: 'synth', occurance: 164 },
//     { name: 'cdrip', occurance: 152 },
//     { name: 'vocal', occurance: 105 },
//     { name: 'percussion', occurance: 87 },
//     { name: '-', occurance: 82 },
//     { name: 'bl', occurance: 81 },
//     { name: 'clap', occurance: 79 },
//     { name: 'f', occurance: 76 },
//     { name: 'mau5', occurance: 72 },
//     { name: 'fm', occurance: 67 },
//     { name: 'fill', occurance: 62 },
//     { name: 'short', occurance: 62 },
//     { name: 'hihat', occurance: 61 },
//     { name: 'a', occurance: 55 },
//     { name: 'noise', occurance: 55 },
//     { name: 'punchy', occurance: 55 },
//     { name: 'c0', occurance: 54 },
//     { name: 'c1', occurance: 54 },
//     { name: 'e', occurance: 54 },
//     { name: 'g', occurance: 51 },
//     { name: 'linn', occurance: 51 },
//     { name: 'clean', occurance: 48 },
//     { name: 'live', occurance: 48 },
//     { name: 'lm1', occurance: 48 },
//     { name: 'disco', occurance: 47 },
//     { name: 'clf', occurance: 46 },
//     { name: 'retro', occurance: 45 },
//     { name: 'd', occurance: 44 },
//     { name: 'f#', occurance: 44 },
//     { name: 'orchestra', occurance: 43 },
//     { name: 'arpeggio', occurance: 42 },
//     { name: 'get', occurance: 42 },
//     { name: 'modern', occurance: 38 },
//     { name: 'perc', occurance: 37 },
//     { name: 'll', occurance: 36 },
//     { name: 'slap', occurance: 36 },
//     { name: 'sweep', occurance: 36 },
//     { name: 'big', occurance: 35 },
//     { name: 'bvs', occurance: 35 },
//     { name: 'lead', occurance: 35 },
//     { name: 'vox', occurance: 34 },
//     { name: 'hi', occurance: 33 },
//     { name: 'hit', occurance: 33 },
//     { name: 'pad', occurance: 33 },
//     { name: 'closed', occurance: 32 },
//     { name: 'em', occurance: 32 },
//     { name: 'blip', occurance: 31 },
//     { name: 'bpm', occurance: 30 },
//     { name: 'full', occurance: 30 },
//     { name: 'cm', occurance: 29 },
//     { name: 'up', occurance: 29 },
//     { name: 'b', occurance: 28 },
//     { name: 'fidm', occurance: 28 },
//     { name: 'os', occurance: 28 },
//     { name: 'tom', occurance: 28 },
//     { name: 'am', occurance: 27 },
//     { name: 'down', occurance: 27 },
//     { name: 'impact', occurance: 27 },
//     { name: 'stab', occurance: 27 },
//     { name: 'tone', occurance: 27 },
//     { name: 'rim', occurance: 26 },
//     { name: 'chords', occurance: 25 },
//     { name: 'f#m', occurance: 25 },
//     { name: 'krne', occurance: 25 },
//     { name: 'top', occurance: 25 },
//     { name: 'crash', occurance: 24 },
//     { name: 'music', occurance: 24 },
//     { name: 'misc', occurance: 23 },
//     { name: 'wet', occurance: 23 },
//     { name: 'claps', occurance: 22 },
//     { name: 'd#', occurance: 21 },
//     { name: 'g#', occurance: 21 },
//     { name: 'hard', occurance: 21 },
//     { name: 'phrase', occurance: 21 },
//     { name: 'cymbal', occurance: 20 },
//     { name: 'drop', occurance: 20 },
//     { name: 'guitar', occurance: 20 },
//     { name: 'chord', occurance: 19 },
//     { name: 'combo', occurance: 19 },
//     { name: 'crazy', occurance: 19 },
//     { name: 'distorted', occurance: 19 },
//     { name: 'dm', occurance: 19 },
//     { name: 'long', occurance: 19 },
//     { name: 'machine', occurance: 19 },
//     { name: 'white', occurance: 19 },
//     { name: 'melody', occurance: 18 },
//     { name: 'sneek', occurance: 18 },
//     ... 1287 more items
//   ]