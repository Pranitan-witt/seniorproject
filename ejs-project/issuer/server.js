var express = require("express");
var app = express();
const request = require('request');
const jwt = require('jsonwebtoken');
const { generateKeyPairSync } = require('crypto');
const path = require('path');
const fs = require('fs');
const walletPath = path.join(process.cwd(), 'wallet');
const bodyParser = require('body-parser');
const { render } = require("ejs");
const holder_tr = path.resolve(__dirname,  '..', 'holder', 'digitalTranscript');
const title = "Issuer";

// set the view engine to ejs
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

var myUUID = undefined;

// use res.render to load up an ejs view file

// index page
app.get("/", function (req, res) {
  if(fs.existsSync(walletPath+'/issuer.credential')){
    res.render('pages/issuer', {
      "fs":fs
    });
  }else{
    res.render("pages/index");
  }
});

app.post("/issuer", function (req, res) {
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
  res.render("pages/issuer", {
    "fs":fs
  });
});

app.get('/checkdetail', function(req, res){
  let json_obj = JSON.parse(fs.readFileSync(process.cwd()+'/requests/holder_request.credential'), 'utf8');
  res.render('pages/issuer', {
    "fs":fs,
    "uuid": json_obj.uuid,
    "name":json_obj.name
  });
});

app.post('/issueDT', function(req, res) {
  let passphrase = req.body.password;
  console.log(passphrase);
  let json_obj = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'requests', 'holder_request.credential'),'utf8'));
  let uuid = json_obj['uuid'];
  let token = json_obj['proof'];
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
        console.log(body);
        jwt.verify(token, body['publickey'], function(err, decoded){
          if(decoded != undefined){
            let myUUID = JSON.parse(fs.readFileSync(walletPath+'/issuer.credential'))['uuid'];
            let prKey = fs.readFileSync(walletPath+'/issuer_privatekey.key');
            let dt = fs.readFileSync('digitalTranscript/pranitan.dt');
            let encrypted_data = jwt.sign(dt, {key:prKey, passphrase}, { algorithm: 'RS256'});
            let digital_tr = {
              "uuid": myUUID,
              "data": encrypted_data
            };

            fs.writeFile(holder_tr+"/holder_tr.dt", JSON.stringify(digital_tr), function(err) {
              if(err) throw err;
              console.log("Holder digital transcript was saved!");
            });

            try {
              fs.unlinkSync(process.cwd()+'/requests/holder_request.credential');
              //file removed
            } catch(err) {
              console.error(err)
            }
            
            res.render('pages/issuer', {
              "fs":fs,
              "myuuid":myuuid
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

app.listen(3002);
console.log("3002 is the issuer port");
