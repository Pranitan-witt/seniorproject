const express = require('express');
const app = express();
const port = 80;
const { generateKeyPairSync } = require('crypto');
const { exec } = require("child_process");
const { v4: uuidv4 } = require('uuid');
app.use(express.json());
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Acces-Control-Allow-Header", "*");
	next();
});

app.get('/', (req, res) => res.send('Welcome!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


app.post('/api/enroll/', (req, res) => {
	/*
	let passphrase = req.body.passphrase; */
	const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      }
    }); 

	console.log(publicKey);
	console.log(privateKey);
	
	let uuid = uuidv4();
	let jsonObj = {
			"uuid":uuid,
			"pukey":publicKey,
			"prkey":privateKey
	};
	
	exec(`docker exec cli peer chaincode invoke -C mychannel -n mycc -c '{"Args":["invoke","`+uuid+`","`+publicKey.replace(/\r?\n|\r/g, "")+`"]}' -o $ORDERER --cafile /opt/home/managedblockchain-tls-chain.pem --tls`, (error, stdout, stderr) => {
		if (error) {
			console.log(`error: ${error.message}`);
			return;
		}
		if (stderr) {
			console.log(`stderr: ${stderr}`);
		}
		
		console.log(`stdout: ${stdout}`);
		res.send(jsonObj);
	});
	

});


app.get('/api/searchkey', (req, res) =>{
    let uuid = req.query.uuid;
	let result;
	exec(`docker exec cli peer chaincode query -C mychannel -n mycc -c '{"Args":["query","`+uuid+`"]}'`, (error, stdout, stderr) => {
		if (error) {
			console.log(`error: ${error.message}`);
			return;
		}
		if (stderr) {
			console.log(`stderr: ${stderr}`);
			return;
		}
		result = stdout;
		console.log(`stdout: ${stdout}`);
		let jsonObj = {"pukey":result.replace("\n", "")};
		res.send(jsonObj);
	});
	
});