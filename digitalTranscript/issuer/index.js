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
      "name":'Srinakharinwirot University' 
  }; 
  request({
      url: "http://localhost:3000/api/enroll/",
      method: "POST",
      json: true,   // <--Very important!!!
      body: myJSONObject
  }, function (error, response, body){
      if(body){
       
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

async function issueDT(uuid){
    let json_obj = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'holder', 'wallet', 'holder.vc'),'utf8'));
    let uuid = json_obj['uuid'];
    console.log(json_obj['uuid']);
    // const ccpPath = path.resolve(__dirname, '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
    //     let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
}
issueDT('test');