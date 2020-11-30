./network.sh down
# ./network.sh up createChannel
./network.sh up createChannel -ca -s couchdb
export PATH=${PWD}/../bin:${PWD}:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
export chaincode_name=key_management
export chaincode_label=${chaincode_name}_1
export chaincode_path=/home/pranitan/fabric-samples/chaincode/key_management/javascript/
export channel_name=mychannel
setGlobalsForOrg1(){
    export CORE_PEER_TLS_ENABLED=true
    export CORE_PEER_LOCALMSPID="Org1MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
    export CORE_PEER_ADDRESS=localhost:7051
}
setGlobalsForOrg2(){
    export CORE_PEER_TLS_ENABLED=true
    export CORE_PEER_LOCALMSPID="Org2MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
    export CORE_PEER_ADDRESS=localhost:9051
}
setGlobalsForOrg1
peer lifecycle chaincode package ${chaincode_name}.tar.gz --path ${chaincode_path} --lang node --label ${chaincode_label}
peer lifecycle chaincode install ${chaincode_name}.tar.gz
setGlobalsForOrg2
peer lifecycle chaincode install ${chaincode_name}.tar.gz

peer lifecycle chaincode queryinstalled
export CC_PACKAGE_ID="$(peer lifecycle chaincode queryinstalled | grep ${chaincode_label} |  awk -F',' '{print $1}' | awk -F' ' '{print $3}')"

setGlobalsForOrderer(){
    export CORE_ORDERER_ADDRESS=localhost:7050 
    export CORE_CA_FILE=${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
}
setGlobalsForOrderer

peer lifecycle chaincode approveformyorg -o ${CORE_ORDERER_ADDRESS} --ordererTLSHostnameOverride orderer.example.com \
--channelID ${channel_name} --name ${chaincode_name} --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile ${CORE_CA_FILE}

setGlobalsForOrg1

peer lifecycle chaincode approveformyorg -o ${CORE_ORDERER_ADDRESS} --ordererTLSHostnameOverride orderer.example.com \
--channelID ${channel_name} --name ${chaincode_name} --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile ${CORE_CA_FILE}


peer lifecycle chaincode checkcommitreadiness --channelID ${channel_name} --name ${chaincode_name} --version 1.0 --sequence 1 --tls \
--cafile ${CORE_CA_FILE} --output json

peer lifecycle chaincode commit -o $CORE_ORDERER_ADDRESS --ordererTLSHostnameOverride orderer.example.com --channelID ${channel_name} \
--name ${chaincode_name} --version 1.0 --sequence 1 --tls --cafile ${CORE_CA_FILE} --peerAddresses localhost:7051 \
--tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 \
--tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt

peer lifecycle chaincode querycommitted --channelID ${channel_name} --name ${chaincode_name} --cafile ${CORE_CA_FILE}

peer chaincode invoke -o ${CORE_ORDERER_ADDRESS} --ordererTLSHostnameOverride orderer.example.com --tls --cafile ${CORE_CA_FILE} -C ${channel_name} \
-n ${chaincode_name} --peerAddresses localhost:7051 --tlsRootCertFiles \
${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 \
--tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '{"function":"initLedger","Args":[]}'

# peer chaincode query -C ${channel_name} -n ${chaincode_name} -c '{"Args":["queryAllKeys"]}'