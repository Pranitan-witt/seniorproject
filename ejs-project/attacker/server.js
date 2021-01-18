var express = require("express");
var app = express();
const request = require('request');
const jwt = require('jsonwebtoken');
const { generateKeyPairSync } = require('crypto');
const path = require('path');
const fs = require('fs');
const walletPath = path.join(process.cwd(), 'wallet');
const bodyParser = require('body-parser');
const issuer_wallet = path.join(process.cwd(), '..', 'issuer', 'wallet');

// set the view engine to ejs
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

function enroll(){
    // let passphrase = req.body.password;
    let passphrase = 'test'
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
        "name":'Attacker' 
    }; 
    request({
        url: "http://localhost:3000/api/enroll/",
        method: "POST",
        json: true,   // <--Very important!!!
        body: myJSONObject
    }, function (error, response, body){
        if(body){
            myuuid = body.uuid;
            fs.writeFile(walletPath+'/attacker.credential', JSON.stringify(body), function (err) {
                if (err) throw err;
                console.log('Attacker VC was saved!');
            });
            fs.writeFile(walletPath+"/attacker_privatekey.key", privateKey, function(err){
                if(err) throw err;
                console.log("Private key was saved!");
            });
            fs.writeFile(walletPath+"/attacker_publickey.cer", publicKey, function(err) {
                if(err) throw err;
                console.log("Public key was saved!");
            });
        }else{
            console.log(`Something went wrong: ${error}`);
        }
    });
}
// enroll();

function issueFakeDT(){
    let passphrase = 'test';
    console.log(passphrase);
    let issuerUUID = JSON.parse(fs.readFileSync(issuer_wallet+'/issuer.credential'))['uuid'];
    let prKey = fs.readFileSync(walletPath+'/attacker_privatekey.key');
    let dt = fs.readFileSync('digitalTranscript/attacker.dt');
    let encrypted_data = jwt.sign(dt, {key:prKey, passphrase}, { algorithm: 'RS256'});
    let digital_tr = {
      "uuid": issuerUUID,
      "data": encrypted_data
    };

    fs.writeFile(process.cwd()+"/fakeTr/attacker_tr.dt", JSON.stringify(digital_tr), function(err) {
      if(err) throw err;
      console.log("Holder digital transcript was saved!");
    });

    fs.writeFile(path.resolve(__dirname, '..', 'verifier', 'requests')+'/attacker_tr.dt', JSON.stringify(digital_tr), function(err) {
        if(err) throw err;
        console.log("Attacker digital transcript sent to Verifier!");
    });
   

}

issueFakeDT();