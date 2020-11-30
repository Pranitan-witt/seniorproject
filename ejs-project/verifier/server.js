var express = require("express");
var app = express();
const request = require('request');
const jwt = require('jsonwebtoken');
const { generateKeyPairSync } = require('crypto');
const path = require('path');
const fs = require('fs');
const walletPath = path.join(process.cwd(), 'wallet');
const bodyParser = require('body-parser');
const title = "Verifier";

// set the view engine to ejs
app.set("view engine", "ejs");
app.use(express.static("public"));
// use res.render to load up an ejs view file
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
var myUUID = undefined;
 
// index page
app.get("/", function (req, res) {
  if(fs.existsSync(walletPath+'/verifier.credential')){
    res.render('pages/verifier', {
      "fs":fs
    });
  }else{
    res.render("pages/index");
  }
});

app.get('showData', function(req, res){
  myUUID = fs.readFileSync(walletPath+'/verifier.credential').uuid;
  uuid = data.uuid;
  res.render('pages/verfier', {
    "fs":fs,
    "uuid":uuid
  });
});

app.post("/verifier", function (req, res) {
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
      "name":'ABC Company' 
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
  
  res.render("pages/verifier", {
    "fs":fs
  });
});

app.get('/checkdetail', function(req, res){
  let json_obj = JSON.parse(fs.readFileSync(process.cwd()+'/requests/holder_tr.dt'), 'utf8');
  res.render('pages/verifier', {
    "fs":fs,
    "confirmButton":true,
    "uuid":json_obj.uuid
  });
});

app.post('/approveDT', function(req, res){
  let data = JSON.parse(fs.readFileSync(process.cwd()+'/requests/holder_tr.dt','utf8'));
  let uuid = data.uuid;
  let token = data.data;
  var result = undefined;
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
        jwt.verify(token, body['publickey'], function(err, decoded){
          if(decoded != undefined){
            result = decoded;
            try {
              fs.copyFileSync(process.cwd()+'/requests/holder_tr.dt', process.cwd()+'/approved/holder_tr.dt');
              fs.unlinkSync(process.cwd()+'/requests/holder_tr.dt');
              //file removed
            } catch(err) {
              console.error(err)
            }
            res.render('pages/verifier', {
              "fs":fs,
              "result":result
            });
          }else{
            console.log('Can not decrypt !')
          }

        });
      }else{
        console.log(`Something went wrong: ${error}`);
      }
    }); 
  }catch(error){
    console.log("Error can't decrypt the cipher!")
  }
});

app.listen(3003);
console.log("3003 is the verifier port");
