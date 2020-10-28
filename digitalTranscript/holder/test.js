const { generateKeyPairSync } = require('crypto');
const passphrase = 'top secret';
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const walletPath = path.join(process.cwd(), 'wallet');
function genKey(){
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

      fs.writeFile(walletPath+'/private.key', privateKey, function (err) {
        if (err) throw err;
        console.log('Private Key Saved!');
      });
      fs.writeFile(walletPath+'/cer.pem', publicKey, function (err){
        if(err) throw err;
        console.log('Public Key Saved!');
      });
}

// function test(){
//   var prKey = fs.readFileSync(walletPath+'/private.key');
//   var token = jwt.sign({ foo: 'bar' }, {key:prKey, passphrase}, { algorithm: 'RS256'});
//   console.log("Token is: "+token+"\n");

//   var cert = fs.readFileSync(walletPath+'/cer.pem');
//   var decodeder;
//   jwt.verify(token, cert, function(err, decoded){
//     // decodeder = decoded;
//   console.log(decoded);
//   });
// console.log("Decoded is:"+decodeder);
// }
// genKey();
var prKey = fs.readFileSync(walletPath+'/private.key');
var token = jwt.sign({ foo: 'bar' }, {key:prKey, passphrase}, { algorithm: 'RS256'});
console.log("Token is: "+token+"\n");

var cert = fs.readFileSync(walletPath+'/cer.pem');
var decodeder;
jwt.verify(token, cert, function(err, decoded){
  // decodeder = decoded;
console.log(decoded);
});
// genKey().then(() => {
//   test();
// })

// genKey().then(() => {
//   var prKey = fs.readFileSync(walletPath+'/private.key');
//   var token = jwt.sign({ foo: 'bar' }, {key:prKey, passphrase}, { algorithm: 'RS256'});
//   console.log("Token is: "+token+"\n");

//   var cert = fs.readFileSync(walletPath+'/cer.pem');
//   var decodeder;
//   jwt.verify(token, cert, function(err, decoded){
//     // decodeder = decoded;
//   console.log(decoded);
//   });
// console.log("Decoded is:"+decodeder);

// }).catch(err => {
//   console.log(err);
// });


