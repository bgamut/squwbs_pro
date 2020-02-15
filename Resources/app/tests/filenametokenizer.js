function investigateWords(fullPathDirectory){
var fs = require('fs');
var path = require('path');
const desktopPath = require('path').join(require('os').homedir(), 'Desktop')
//var fullPathDirectory=path.join(desktopPath,'mastered_files')
//var fullPathDirectory=path.join(desktopPath,'data_prep')
//var fullPathDirectory='/Users/Shared/Halcyon Sky Library/Samples'
const isDirectory = filePath => fs.statSync(filePath).isDirectory();
const getDirectories = filePath =>
    fs.readdirSync(filePath).map(name => path.join(filePath, name)).filter(isDirectory);

const isFile = filePath => fs.statSync(filePath).isFile();  
const getFiles = filePath =>
    fs.readdirSync(filePath).map(name => path.join(filePath, name)).filter(isFile);

const getFilesRecursively = (filePath) => {
    let dirs = getDirectories(filePath);
    let files = dirs
        .map(dir => getFilesRecursively(dir)) // go through each directory
        .reduce((a,b) => a.concat(b), []);    // map returns a 2d array (array of file arrays) so flatten
    return files.concat(getFiles(filePath));
};

var newFileList=getFilesRecursively(fullPathDirectory)
var filePathList=[]
for (index in newFileList){
    if(path.basename(newFileList[index])!='.DS_Store'){
        filePathList.push(newFileList[index])
    }
}
newFileList=filePathList.slice()
console.log(newFileList)
var bagOfWords=[]
var newBagOfWords={}
for (index in newFileList){
    //console.log(newFileList[index].replace(/[/_.]/g,' '))
    newFileList[index]=newFileList[index].replace(/[/_.-]/g,' ')
    if(newFileList[index].indexOf('one shot')!==-1){
        //console.log('one shot!')
    }
    else{
        var tempFileNameSplit1=newFileList[index].split(' ')
        for(secIndex in tempFileNameSplit1){
            var parent =fullPathDirectory.replace(/[/_.]/g,' ')
            if(parent.split(' ').indexOf(tempFileNameSplit1[secIndex])===-1){
                bagOfWords.push(tempFileNameSplit1[secIndex].toLowerCase())
            }
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
}
// //oneshot
// ////drums
// //////kick
// //////snare
// //////clap
// //////hihat
// //////perc
// ////synth
// ////bass
// ////pad
// ////vocal
// //loop

// // [
// //     { name: 'wav', occurance: 1139 },
// //     { name: 'drums', occurance: 403 },
// //     { name: 'loops', occurance: 391 },
// //     { name: 'one', occurance: 349 },
// //     { name: 'shots', occurance: 349 },
// //     { name: 'construction', occurance: 342 },
// //     { name: 'synth', occurance: 213 },
// //     { name: 'note', occurance: 153 },
// //     { name: 'kick', occurance: 152 },
// //     { name: 'snare', occurance: 151 },
// //     { name: 'sfx', occurance: 101 },
// //     { name: 'chord', occurance: 97 },
// //     { name: 'hihat', occurance: 88 },
// //     { name: 'percussion', occurance: 64 },
// //     { name: 'closedhh', occurance: 62 },
// //     { name: 'c', occurance: 56 },
// //     { name: 'shaker', occurance: 53 },
// //     { name: 'clap', occurance: 48 },
// //     { name: 'bass', occurance: 40 },
// //     { name: 'artcore', occurance: 34 },
// //     { name: 'crackles', occurance: 34 },
// //     { name: 'darjeeling', occurance: 34 },
// //     { name: 'ds', occurance: 34 },
// //     { name: 'hover', occurance: 34 },
// //     { name: 'layabout', occurance: 34 },
// //     { name: 'pagoda', occurance: 34 },
// //     { name: 'surface', occurance: 34 },
// //     { name: 'nautilus', occurance: 32 },
// //     { name: 'seabed', occurance: 32 },
// //     { name: 'dark', occurance: 31 },
// //     { name: 'pad', occurance: 31 },
// //     { name: 'absorbed', occurance: 30 },
// //     { name: 'astral', occurance: 30 },
// //     { name: 'capsized', occurance: 30 },
// //     { name: 'glacier', occurance: 30 },
// //     { name: 'msv', occurance: 30 },
// //     { name: 'prismatic', occurance: 30 },
// //     { name: 'rushing', occurance: 30 },
// //     { name: 'sunstream', occurance: 30 },
// //     { name: 'triptych', occurance: 30 },
// //     { name: 'acoustic', occurance: 28 },
// //     { name: 'infected', occurance: 28 },
// //     { name: 'synesthesia', occurance: 28 },
// //     { name: 'tachyon', occurance: 28 },
// //     { name: 'tinker', occurance: 28 },
// //     { name: 'tricolour', occurance: 28 },
// //     { name: 'cymbal', occurance: 26 },
// //     { name: 'e', occurance: 26 },
// //     { name: 'openhh', occurance: 26 },
// //     { name: 'swimmer', occurance: 26 },
// //     { name: 'trickle', occurance: 26 },
// //     { name: 'a', occurance: 25 },
// //     { name: 'perc', occurance: 25 },
// //     { name: 'blackjack', occurance: 24 },
// //     { name: 'blondebeach', occurance: 24 },
// //     { name: 'darkelixir', occurance: 24 },
// //     { name: 'g', occurance: 24 },
// //     { name: 'shadow', occurance: 24 },
// //     { name: 'tension', occurance: 24 },
// //     { name: 'tom', occurance: 24 },
// //     { name: 'clearsky', occurance: 23 },
// //     { name: 'darkforest', occurance: 23 },
// //     { name: 'bluehorizon', occurance: 22 },
// //     { name: 'cheaplaughs', occurance: 22 },
// //     { name: 'darkdancer', occurance: 22 },
// //     { name: 'doubleagent', occurance: 22 },
// //     { name: 'fadededges', occurance: 22 },
// //     { name: 'aerodub', occurance: 21 },
// //     { name: 'bigdreamer', occurance: 21 },
// //     { name: 'nighttrain', occurance: 21 },
// //     { name: 'oldphotos', occurance: 21 },
// //     { name: 'wayhome', occurance: 21 },
// //     { name: 'atdawn', occurance: 20 },
// //     { name: 'ghosttrain', occurance: 20 },
// //     { name: 'piano', occurance: 20 },
// //     { name: 'silverdust', occurance: 20 },
// //     { name: 'smokestack', occurance: 20 },
// //     { name: 'emeraldcity', occurance: 19 },
// //     { name: 'whitehorses', occurance: 19 },
// //     { name: '&', occurance: 18 },
// //     { name: 'crash', occurance: 18 },
// //     { name: 'lick', occurance: 18 },
// //     { name: 'd', occurance: 17 },
// //     { name: 'purplewaterfall', occurance: 16 },
// //     { name: 'stab', occurance: 16 },
// //     { name: 'f#', occurance: 15 },
// //     { name: 'ferris', occurance: 15 },
// //     { name: 'ferriswheel', occurance: 15 },
// //     { name: 'trippi', occurance: 15 },
// //     { name: 'crackle', occurance: 14 },
// //     { name: 'rim', occurance: 14 },
// //     { name: 'b', occurance: 13 },
// //     { name: 'flowers', occurance: 13 },
// //     { name: 'forest', occurance: 13 },
// //     { name: 'hit', occurance: 13 },
// //     { name: 'train', occurance: 13 },
// //     { name: 'lead', occurance: 12 },
// //     { name: 'vocal', occurance: 12 },
// //     { name: 'vox', occurance: 12 },
// //     { name: 'a#', occurance: 11 },
// //     ... 281 more items
// //   ]

var fs = require('fs');
var path = require('path');
const desktopPath = require('path').join(require('os').homedir(), 'Desktop')
var fullPathDirectory='/Users/Shared/'
function hashPath(fullPathDirectory){
    const isDirectory = filePath => fs.statSync(filePath).isDirectory();
    const getDirectories = filePath =>
        fs.readdirSync(filePath).map(name => path.join(filePath, name)).filter(isDirectory);

    const isFile = filePath => fs.statSync(filePath).isFile();  
    const getFiles = filePath =>
        fs.readdirSync(filePath).map(name => path.join(filePath, name)).filter(isFile);

    const getFilesRecursively = (filePath) => {
        let dirs = getDirectories(filePath);
        let files = dirs
            .map(dir => getFilesRecursively(dir)) // go through each directory
            .reduce((a,b) => a.concat(b), []);    // map returns a 2d array (array of file arrays) so flatten
        return files.concat(getFiles(filePath));
    };

    var newFileList=getFilesRecursively(fullPathDirectory)
    var filePathList=[]
    for (index in newFileList){
        if(path.basename(newFileList[index])!='.DS_Store'){
            filePathList.push(newFileList[index])
        }
    }
    newFileList=filePathList.slice()
    // console.log(newFileList)
    var theList=[]
    var listOfExtensions=[
        'wav',
        'caf',
        'mp3',
        'flac'
    ]
    var unorderedInitHashDict={
        'one shot':0,
        'drum':0,
        'kick':0,
        'clap':0,
        'snare':0,
        'tom':0,
        'cymbal':0,
        'open':0,
        'close':0,
        'hihat':0,
        'hh':0,
        'hat':0,
        'perc':0,
        'percussion':0,
        'loop':0,
        'vocal':0,
        'vox':0,
        'bass':0,
        'shaker':0,
        'snap':0,
        'pad':0,
        'acoustic':0,
        'synth':0,
        'piano':0,
        'keys':0,
        'lead':0,
        'fx':0,
        'note':0,
        'ambience':0,
        'chord':0,
        'lick':0,
        'sweep':0,
        'hit':0,
        'stab':0,
        'scratch':0,
        'voc':0,
        'organ':0,
        'guitar':0,
        'horn':0,
        'brass':0,
        'phrase':0,
        'fill':0,
        'string':0,
        'wood':0,
        'misc':0,
        'combo':0,
        'sax':0,
        'ride':0,
        'open hat':0,
        'closed hat':0
    }
    var keys = Object.keys(unorderedInitHashDict)
    keys.sort()
    var initHashDict={}
    for (var i=0; i<keys.length; i++){
        initHashDict[keys[i]]=unorderedInitHashDict[keys[i]]
    }
    //console.log(initHashDict)
    function keywordSearch(filePath){ 
        filePath.split('/').forEach(function(word){
            var actualWord=word.toLowerCase()
            //keywordList.forEach(function(key){
            Object.keys(initHashDict).forEach(function(key){
                if(actualWord.indexOf(key)!==-1){
                    initHashDict[key]+=1
                }
            })
        })
        return initHashDict
    }

    newFileList.forEach(function(filePath){
        var ext = path.extname(path.basename(filePath)).replace(/[.]/g,'')
        if(listOfExtensions.indexOf(ext)!==-1){
            theList.push({
                path:filePath,
                hashes:Object.values(keywordSearch(filePath)),
                category:''
            }) 
            Object.keys(initHashDict).forEach(function(key){
                initHashDict[key]=0
            })
            
        }
        
    })
    //console.log(theList)
    var json = JSON.stringify({header:Object.keys(initHashDict),data:theList},null,4)
    fs.writeFile('../src/assets/soundFilePath.json', json, 'utf8', function(){
        console.log('soundFilePath.json written')
    })
    return theList
}
hashPath(fullPathDirectory)
//investigateWords('/Users/bernardahn/Splice')