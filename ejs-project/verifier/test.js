const fs = require('fs');
const request = require('request');
const jwt = require('jsonwebtoken');
function checkFakeDT(){

  let data = JSON.parse(fs.readFileSync(process.cwd()+'/requests/attacker_tr.dt','utf8'));
  // let data = JSON.parse(fs.readFileSync(process.cwd()+'/requests/holder_tr.dt', 'utf8'));
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
            console.log('Decrypted!');
          }else{
            console.log('Can not decrypt !');
          }

        });
      }else{
        console.log(`Something went wrong: ${error}`);
      }
    }); 
  }catch(error){
    console.log("Error please require request")
  }
}
checkFakeDT();
