const {ethers} = require("ethers");
const json = require("../build/contracts/SwashOnPolygon.json");

require('dotenv').config()
const accountPrivateKey = process.env.accountPrivateKey;
const provider = require("./provider");

// Deploy function
async function deploy() {

    let network = process.argv.slice(2, 3)[0];
    const signer = new ethers.Wallet(accountPrivateKey, provider.getProvider(network));



    const SwashContractFactory = await new ethers.ContractFactory(json.abi, json.bytecode, signer);

    let rootChainManager = process.argv.slice(3)[0];
    console.log('======================================')
    console.log('network:' + network)
    console.log('rootChainManager:' + rootChainManager)
    console.log('Signer:' + signer.address)
    console.log('======================================')

    const swashContract = await SwashContractFactory.deploy(rootChainManager)//, {gasLimit:1000000, gasPrice:50000000});
    await swashContract.deployed();

    console.log("SwashContractForPolygon deployed(network=" + network +"): " + swashContract.address);

}

deploy()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
