var express = require("express");
var app = express();
const { generateKeyPairSync } = require('crypto');
const path = require('path');
const fs = require('fs');
// const passphrase = 'top secret';
const request = require('request');
// const prompt = require('prompt-sync')();
const jwt = require('jsonwebtoken');
const walletPath = path.join(process.cwd(), 'wallet');
const bodyParser = require ( "body-parser" );

// set the view engine to ejs
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use ( bodyParser.urlencoded ( { extended : false } ) );
// use res.render to load up an ejs view file
const title = "Holder";
// index page
app.get("/", function (req, res) {
  fs.access(walletPath+'/holder.credential', fs.F_OK, (err) => {
    if (err) {
      res.render('pages/index');
    }else{
      res.render('pages/holder',{
        title: title
      });
    }
  })
    
});

app.post("/test", function (req, res){
  // console.log(req.body.password);
  fs.access(walletPath+'/holder.credential', fs.F_OK, (err) => {
    if(!err){
      res.render('pages/holder');
    }
  });
  const passphrase = req.body.password;
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
    title:title
  });
});

app.get('/requestDT', function(req, res){
  let json_obj = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'wallet', 'holder.credential'),'utf8'));
  let prKey = fs.readFileSync(path.resolve(__dirname, 'wallet', 'holder_privatekey.key'));
  var token = jwt.sign(new Date().toString(), {key:prKey, passphrase}, { algorithm: 'RS256'});
  json_obj.proof = token
  fs.writeFile(issuer_walletPath+"/holder_request.credential", JSON.stringify(json_obj), function(err) {
    if(err) throw err;
    console.log("Holder request vc was saved!");
  });
  
});

app.get("/holder", function (req, res) {

  var list = [1, 2, 3, 4, 5];
  var i = 0;
  var mock_up_data = [
    "นายประณิธาน วิทยารณยุทธ",
    "CP463 Artificial Intelligence",
    "A",
  ];

  res.render("pages/holder", {
    title: title,
    list: list,
    mock_up_data: mock_up_data,
  });
});

app.listen(3001);
console.log("3001 is the holder port");
