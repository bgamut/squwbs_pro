var dotenv= require('dotenv') ;
//var {_} =require('lodash');

const result = dotenv.config();

let envs;

if (!('error' in result)) {
  envs = result.parsed;
} else {
  envs = {};
  //_.each(process.env, (value, key) => envs[key] = value);
  envs={...process.env};
}

module.exports = envs;