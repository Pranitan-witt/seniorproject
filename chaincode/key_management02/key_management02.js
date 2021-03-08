const shim = require('fabric-shim');
const util = require('util');

var Chaincode = class {

    // Initialize the chaincode
    async Init(stub) {
      console.info('========= key_management02 Init =========');
      let ret = stub.getFunctionAndParameters();
      console.info(ret);
      let args = ret.params;
      // initialise only if 4 parameters passed.
      if (args.length != 2) {
        return shim.error('Incorrect number of arguments. Expecting 2');
      }

      let uuid = args[0];
      let pu_key = args[1];
  
      // let A = args[0];
      // let B = args[2];
      // let Aval = args[1];
      // let Bval = args[3];

      try{
        await stub.putState(uuid, Buffer.from(pu_key));
        return shim.success();
      }catch (err){
        return shim.error(err);
      }
  
      // try {
      //   await stub.putState(A, Buffer.from(Aval));
      //   try {
      //     await stub.putState(B, Buffer.from(Bval));
      //     return shim.success();
      //   } catch (err) {
      //     return shim.error(err);
      //   }
      // } catch (err) {
      //   return shim.error(err);
      // }
    }
  
    async Invoke(stub) {
      let ret = stub.getFunctionAndParameters();
      console.info(ret);
      let method = this[ret.fcn];
      if (!method) {
        console.log('no method of name:' + ret.fcn + ' found');
        return shim.success();
      }
      try {
        let payload = await method(stub, ret.params);
        return shim.success(payload);
      } catch (err) {
        console.log(err);
        return shim.error(err);
      }
    }
  
    async invoke(stub, args) {
      if (args.length != 2) {
        throw new Error('Incorrect number of arguments. Expecting 2');
      }
  
      let uuid = args[0];
      let pu_key = args[1];
      
  
      // Write the states back to the ledger
      await stub.putState(uuid, Buffer.from(pu_key));
  
    }
  
    // Deletes an entity from state
    async delete(stub, args) {
      if (args.length != 1) {
        throw new Error('Incorrect number of arguments. Expecting 1');
      }
  
      let uuid = args[0];
  
      // Delete the key from the state in ledger
      await stub.deleteState(uuid);
    }
  
    // query callback representing the query of a chaincode
    async query(stub, args) {
      if (args.length != 1) {
        throw new Error('Incorrect number of arguments. Expecting name of the person to query')
      }
  
      let jsonResp = {};
      let uuid = args[0];
  
      // Get the state from the ledger
      let Databytes = await stub.getState(uuid);
      if (!Databytes) {
        jsonResp.error = 'Failed to get state for ' + A;
        throw new Error(JSON.stringify(jsonResp));
      }
  
      jsonResp.uuid = uuid;
      jsonResp.publickey = Databytes.toString();
      console.info('Query Response:');
      console.info(jsonResp);
      return Databytes;
    }
  };
  
  shim.start(new Chaincode());
  