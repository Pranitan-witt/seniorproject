'use strict';
const { generateKeyPairSync } = require('crypto');
const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const passphrase = 'top secret';
const request = require('request');
const jwt = require('jsonwebtoken');
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
      "name":'Verifier' 
  }; 
  request({
      url: "http://localhost:3000/api/enroll/",
      method: "POST",
      json: true,   // <--Very important!!!
      body: myJSONObject
  }, function (error, response, body){
      if(body){
        fs.writeFile(walletPath+'/verifier.credential', JSON.stringify(body), function (err) {
          if (err) throw err;
          console.log('Verifier VC was saved!');
        });
        fs.writeFile(walletPath+"/verifier_privatekey.key", privateKey, function(err){
          if(err) throw err;
          console.log("Private key was saved!");
        });
        fs.writeFile(walletPath+"/verifier_publickey.cer", publicKey, function(err) {
          if(err) throw err;
          console.log("Public key was saved!");
        });
      }else{
          console.log(`Something went wrong: ${error}`);
      }
  });

}
// enroll();

