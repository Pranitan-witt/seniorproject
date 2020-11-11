'use strict';
const { generateKeyPairSync } = require('crypto');
const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const passphrase = 'top secret';
const request = require('request');
const prompt = require('prompt-sync')();
const jwt = require('jsonwebtoken');
const walletPath = path.join(process.cwd(), 'wallet');
const issuer_walletPath = path.resolve(__dirname, '..', 'issuer', 'requests')
// const passphrase = prompt('What is your name: ');
// console.log(`Here is passphrase: ${passphrase}`);
async function enroll(){
  
  const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: passphrase
      }
    });
  var myJSONObject = { 
      "publickey":publicKey, 
      "name":'Pranitan Wittayaronnayutt' 
  }; 
  request({
      url: "http://localhost:3000/api/enroll/",
      method: "POST",
      json: true,   // <--Very important!!!
      body: myJSONObject
  }, function (error, response, body){
      if(body){
        fs.writeFile(walletPath+'/holder.credential', JSON.stringify(body), function (err) {
          if (err) throw err;
          console.log('Holder VC was saved!');
        });
        fs.writeFile(walletPath+"/holder_privatekey.key", privateKey, function(err){
          if(err) throw err;
          console.log("Private key was saved!");
        });
        fs.writeFile(walletPath+"/holder_publickey.cer", publicKey, function(err) {
          if(err) throw err;
          console.log("Public key was saved!");
        });
      }else{
          console.log(`Something went wrong: ${error}`);
      }
  });

}
// enroll();

async function searchKey(uuid){
  var myJSONObject = { 
    "uuid":uuid
  }; 
  request({
    url: "http://localhost:3000/api/searchkey/",
    method: "POST",
    json: true,   // <--Very important!!!
    body: myJSONObject
  }, function (error, response, body){
      if(body){
        return body;
      }else{
          console.log(`Something went wrong: ${error}`);
      }
  });
    
}

async function requestDT(){
  let json_obj = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'wallet', 'holder.credential'),'utf8'));
  let prKey = fs.readFileSync(path.resolve(__dirname, 'wallet', 'holder_privatekey.key'));
  var token = jwt.sign(new Date().toString(), {key:prKey, passphrase}, { algorithm: 'RS256'});
  json_obj.proof = token
  fs.writeFile(issuer_walletPath+"/holder_request.credential", JSON.stringify(json_obj), function(err) {
    if(err) throw err;
    console.log("Holder request vc was saved!");
  });
}

// requestDT();

console.log(JSON.parse(fs.readFileSync(path.resolve(__dirname,'digitalTranscript', 'holder_tr.dt')), 'utf8'));