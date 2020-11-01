'use strict';
const { generateKeyPairSync } = require('crypto');
const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const passphrase = 'top secret';
const request = require('request');
const jwt = require('jsonwebtoken');
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
        fs.writeFile(walletPath+'/issuer.credential', JSON.stringify(body), function (err) {
          if (err) throw err;
          console.log('Issuer VC was saved!');
        });
        fs.writeFile(walletPath+"/issuer_privatekey.key", privateKey, function(err){
          if(err) throw err;
          console.log("Private key was saved!");
        });
        fs.writeFile(walletPath+"/issuer_publickey.cer", publicKey, function(err) {
          if(err) throw err;
          console.log("Public key was saved!");
        });
      }else{
          console.log(`Something went wrong: ${error}`);
      }
  });

}
enroll();

async function issueDT(){
    let json_obj = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'requests', 'holder_request.credential'),'utf8'));
    let uuid = json_obj['uuid'];
    let token = json_obj['proof'];
    let data = undefined;
    console.log(uuid);
    try{
      var myJSONObject = { 
        "uuid":uuid
      }; 
      request({
        url: "http://localhost:3000/api/searchkey/",
        method: "POST",
        json: true,   // <--Very important!!!
        body: myJSONObject
        }, 
        function (error, response, body){
        if(body){
          jwt.verify(token, body['proof'], function(err, decoded){
            if(decoded != undefined){
              digital_Tr = {
                // "uuid":
              };
            }else{
              console.log('Can not decrypt')
            }

          });
        }else{
          console.log(`Something went wrong: ${error}`);
        }
      }); 
    }catch(error){
      console.log("Error can't decrypt the cipher!")
    }
}

// let test = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'digitalTranscript', 'pranitan.dt'), 'utf-8'));
// console.log(test['@context']);
// issueDT();

