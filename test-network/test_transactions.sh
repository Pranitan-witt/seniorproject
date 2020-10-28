export PATH=${PWD}/../bin:${PWD}:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051
begin=0
max=100
start=`date +%s.%N`
#for i in {1..10}
for (( i = $begin; i < $max; i++ ))
 do
	peer chaincode query -C mychannel -n key_management -c '{"Args":["queryAllKeys"]}'
 done
end=`date +%s.%N`
#runtime=$((echo $end-$start) | bc)
echo "---------------------------------------------------------------------------------------------------"
#echo "Total time is $runtime seconds"
printf "Total time is %.3f seconds \n" $runtime
echo "All transactions = $max"
