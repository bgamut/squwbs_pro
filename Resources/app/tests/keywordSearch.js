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
function keywordSearch(filePath){
    var initHashDict={
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
        'sax':0
    }
    
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
            hashes:keywordSearch(filePath)
        }) 
    }
       
})
console.log(theList)
return theList
}
hashPath(fullPathDirectory)