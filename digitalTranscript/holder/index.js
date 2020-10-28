'use strict';
const { generateKeyPairSync } = require('crypto');
const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const passphrase = 'top secret';
const request = require('request');
const prompt = require('prompt-sync')();
const walletPath = path.join(process.cwd(), 'wallet');

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
        fs.writeFile(walletPath+"/holder_privaetkey.key", privateKey, function(err){
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