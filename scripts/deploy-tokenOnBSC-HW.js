const {ethers, network} = require("hardhat");
const json = require("../artifacts/contracts/SwashOnBsc.sol/SWASHOnBsc.json");

require('dotenv').config()
const provider = require("./provider");
const {LedgerSigner} = require("@ethersproject/hardware-wallets");

// Deploy function
async function deploy() {

    let path = "m'/44'/60'/0'/0/0";
    let type = `hid`;

    const signer = new LedgerSigner(provider.getProvider(network.name), type, path);
    const SwashContractFactory = await new ethers.ContractFactory(json.abi, json.bytecode, signer);

    let swashContract = await SwashContractFactory.deploy();
    await swashContract.deployed();

    console.log("SwashContractForPolygon deployed(network=" + network +"): " + swashContract.address);
}

deploy()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
