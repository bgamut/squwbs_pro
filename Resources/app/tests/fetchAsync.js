const stringifyObject= require('stringify-object')
const fetch = require('node-fetch')
const withQuery = require('with-query').default;
var async = require('async')
var portnumber=8000
var endPoint='one-file'
let urls = ["/Users/bernardahn/Desktop/data_prep/clap/GET_sneek_clap_04.wav", "/Users/bernardahn/Desktop/data_prep/clap/JUST_clap_808_layer.wav", "/Users/bernardahn/Desktop/data_prep/clap/KSHMR_Claps_01_-_Classic_Clap.wav"];
let array = new Array;
function tick(url){
    console.log(url)
    fetch(withQuery('http://127.0.0.1:'+portnumber+'/'+endPoint, {
    file:url,
    mode:'cors',
    }))
    .then(result=>{
        return result.json()
    })
    .then((json)=>{
        console.log(stringifyObject(json))
        return(stringifyObject(json))
    })
    .catch((err)=>{
        console.error(err)
        return(null)
    })
}
function timer(ms){
    return new Promise(res=>setTimeout(res,ms))
}
// async function result(urls){
//     for(let i =0; i<urls.length; i++){
//         const value = await tick(urls[i])
//         await timer(5000) 
//         console.log(value)
//         array.push(value)
//     }
//     console.log(array)
// }
function result(urls){
    async.mapLimit(urls, 1,async function(url){
        var value=await tick(url)
        console.log(value)
        return value
    },(err,results)=>{
        if(err){
            console.log(err)
        }
        console.log(results)
    })
}

result(urls)
