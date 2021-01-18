export PATH=${PWD}/../bin:${PWD}:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051
export CORE_ORDERER_ADDRESS=localhost:7050 
export CORE_CA_FILE=${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
begin=0
max=100
start=`date +%s.%N`
#for i in {1..10}
for (( i = $begin; i < $max; i++ ))
 do
	echo $i
	# peer chaincode query -C mychannel -n key_management -c '{"Args":["queryKey", "19"]}'
	peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n key_management --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '{"function":"createKey","Args":["'$i'","'$i'"]}'
 done
end=`date +%s.%N`
runtime=$((echo $end-$start) | bc)
echo "---------------------------------------------------------------------------------------------------"
#echo "Total time is $runtime seconds"
printf "Total time is %.3f seconds \n" $runtime
echo "All transactions = $max"
