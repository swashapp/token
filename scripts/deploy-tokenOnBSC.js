const {ethers, network, waffle} = require("hardhat");
const json = require("../artifacts/contracts/SwashOnBsc.sol/SWASHOnBsc.json");

require('dotenv').config()

// Deploy function
async function deploy() {

    const [signer] = await ethers.getSigners();

    const SwashContractFactory = await new ethers.ContractFactory(json.abi, json.bytecode, signer);

    let swashContract = await SwashContractFactory.deploy({gasLimit:5000000});
    await swashContract.deployed();

    console.log("SwashContractForPolygon deployed(network=" + network +"): " + swashContract.address);
}

deploy()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
