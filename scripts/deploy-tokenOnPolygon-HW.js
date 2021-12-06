const {ethers} = require("ethers");
const json = require("../build/contracts/SwashOnPolygon.json");

require('dotenv').config()
const provider = require("./provider");
const {LedgerSigner} = require("@ethersproject/hardware-wallets");

// Deploy function
async function deploy() {

    let path = "m'/44'/60'/0'/0/0";
    let type = `hid`;

    let network = process.argv.slice(2, 3)[0];
    const signer = new LedgerSigner(provider.getProvider(network), type, path);
    const SwashContractFactory = await new ethers.ContractFactory(json.abi, json.bytecode, signer);

    let rootChainManager = process.argv.slice(3)[0];
    console.log('rootChainManager')
    console.log(rootChainManager)
    console.log('Signer')
    console.log(signer.address)
    const swashContract = await SwashContractFactory.deploy(rootChainManager);
    await swashContract.deployed();

    console.log("SwashContractForPolygon deployed(network=" + network +"): " + swashContract.address);

}

deploy()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
