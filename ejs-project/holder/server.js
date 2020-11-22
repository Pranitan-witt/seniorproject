var express = require("express");
var app = express();
const request = require('request');
const jwt = require('jsonwebtoken');
const { generateKeyPairSync } = require('crypto');
const path = require('path');
const fs = require('fs');
const walletPath = path.join(process.cwd(), 'wallet');
const bodyParser = require('body-parser')

// set the view engine to ejs
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// use res.render to load up an ejs view file

// index page
app.get("/", function (req, res) {
  if(fs.existsSync(walletPath+'/holder.credential')){
    res.render('pages/holder');
  }else{
    res.render("pages/index");
  }
});

app.post("/holder", function (req, res) {
  let passphrase = req.body.password;
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


  res.render("pages/holder");
});

app.listen(3001);
console.log("3001 is the holder port");
