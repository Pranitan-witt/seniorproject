'use strict';

const { Contract } = require('fabric-contract-api');

class Key_management extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const keys = [
          {
           
          }
        ];

         for (let i = 0; i < keys.length; i++) {
             await ctx.stub.putState('UUID' + i, Buffer.from(JSON.stringify(keys[i])));
             console.info('Added <--> ', keys[i]);
         }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryKey(ctx, uuid) {
        const dataAsBytes = await ctx.stub.getState(uuid); // get the car from chaincode state
        if (!dataAsBytes || dataAsBytes.length === 0) {
            throw new Error(`${uuid} does not exist`);
        }
        console.log(dataAsBytes.toString());
        return dataAsBytes.toString();
    }

    async createKey(ctx, uuid, publickey) {
        console.info('============= START : Create Car ===========');

        const data = {
            publickey
        };

        await ctx.stub.putState(uuid, Buffer.from(JSON.stringify(data)));
        console.info('============= END : Create Car ===========');
    }

    async queryAllKeys(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

}

module.exports = Key_management;
