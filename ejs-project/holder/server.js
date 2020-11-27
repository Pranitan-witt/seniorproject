var express = require("express");
var app = express();
const request = require('request');
const jwt = require('jsonwebtoken');
const { generateKeyPairSync } = require('crypto');
const path = require('path');
const fs = require('fs');
const walletPath = path.join(process.cwd(), 'wallet');
const bodyParser = require('body-parser');

const issuer_walletPath = path.resolve(__dirname, '..', 'issuer', 'requests')

// set the view engine to ejs
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

var myUUID = undefined;

// use res.render to load up an ejs view file
const title = "Holder";
// index page
app.get("/", function (req, res) {

  if(fs.existsSync(walletPath+'/holder.credential')){
    res.render('pages/holder', {

      "fs":fs
    });
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

  
  res.render("pages/holder", {
    "fs":fs
  });
});

app.post("/requestDT", function(req, res){
  let passphrase = req.body.password;
  let json_obj = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'wallet', 'holder.credential'),'utf8'));
  let prKey = fs.readFileSync(path.resolve(__dirname, 'wallet', 'holder_privatekey.key'));
  var token = jwt.sign(new Date().toString(), {key:prKey, passphrase}, { algorithm: 'RS256'});
  json_obj.proof = token
  fs.writeFile(issuer_walletPath+"/holder_request.credential", JSON.stringify(json_obj), function(err) {
    if(err) throw err;
    console.log("Holder request vc was saved!");
  });
  res.render("pages/holder", {
    "fs":fs
  });
});

app.get("/showDT", function(req, res){
  let data = JSON.parse(fs.readFileSync(process.cwd()+'/digitalTranscript/holder_tr.dt','utf8'));
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
            res.render('pages/holder', {
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

app.get('/sendDT', function(req, res){
  console.log(path.resolve(__dirname, '..', 'verifier', 'requests')+'/holder_tr.dt');
  fs.copyFileSync(process.cwd()+'/digitalTranscript/holder_tr.dt', path.resolve(__dirname, '..', 'verifier', 'requests')+'/holder_tr.dt');
  res.render('pages/holder', {
    "fs":fs
  });
});

app.listen(3001);
console.log("3001 is the holder port");
