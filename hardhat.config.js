require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

//require("@openzeppelin/contracts");
require('dotenv').config()
const accountPrivateKey = process.env.accountPrivateKey;
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat:{
      accounts: {
        count: 300
      },
      allowUnlimitedContractSize: true
    },

    mainnet: {
      url: "https://mainnet.infura.io/v3/c941387bd4d8467285c24d75ad3574a4",
      accounts: [accountPrivateKey]
    },
    ropsten: {
      url: "https://ropsten.infura.io/v3/c941387bd4d8467285c24d75ad3574a4",
      accounts: [accountPrivateKey]
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/c941387bd4d8467285c24d75ad3574a4",
      accounts: [accountPrivateKey]
    },
    xdai: {
      url: "https://rpc.xdaichain.com",
      accounts: [accountPrivateKey]
    },
    bsc: {
      url: "https://bsc-dataseed1.defibit.io",
      accounts: [accountPrivateKey]
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    // apiKey: process.env.ETHERSCAN_API_KEY
    apiKey: process.env.BSCSCAN_API_KEY
  },
  solidity: {
    version: "0.8.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 600,
      },
    },
  },
  mocha: {
    timeout:50000000,
    enableTimeouts:false
  },
};
