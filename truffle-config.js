require('dotenv').config();
const utils = require('web3-utils')

const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
	
	development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
	
	kovan: {
		provider: function() {
			return new HDWalletProvider(process.env.MNEMONIC, `https://kovan.infura.io/v3/${process.env.INFURA_TOKEN}`)
		},
		network_id: 0x2A,
		from: process.env.OWNER_ADDRESS,
		gas: 7 * 1000000,
		gasPrice: utils.toWei('8', 'gwei')
	},	
	
	rinkeby: {
		provider: function() {
			return new HDWalletProvider(process.env.MNEMONIC, `https://rinkeby.infura.io/v3/${process.env.INFURA_TOKEN}`)
		},
		network_id: 0x4,
		from: process.env.OWNER_ADDRESS,
		gas: 7 * 1000000,
		gasPrice: utils.toWei('8', 'gwei')
	},
	
	goerli: {
		provider: function() {
			return new HDWalletProvider(process.env.MNEMONIC, `https://goerli.infura.io/v3/${process.env.INFURA_TOKEN}`)
		},
		network_id: 0x5,
		from: process.env.OWNER_ADDRESS,
		gas: 7 * 1000000,
		gasPrice: utils.toWei('8', 'gwei')
	},
	
	mainnet: {
		provider: function() {
			return new HDWalletProvider(process.env.MNEMONIC, `https://mainnet.infura.io/v3/${process.env.INFURA_TOKEN}`)
		},		
		network_id: 0x1,
		from: process.env.OWNER_ADDRESS,
		gas: 2 * 1000000,
		gasPrice: utils.toWei('105', 'gwei')
	}    

  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    allowUncaught: true
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.6",    // Fetch exact version from solc-bin (default: truffle's version)
      docker: false,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
      optimizer: {
        enabled: false,
         runs: 200
       },
       evmVersion: "istanbul"
     }
    }
  },

  // Truffle DB is currently disabled by default; to enable it, change enabled: false to enabled: true
  //
  // Note: if you migrated your contracts prior to enabling this field in your Truffle project and want
  // those previously migrated contracts available in the .db directory, you will need to run the following:
  // $ truffle migrate --reset --compile-all

  db: {
    enabled: false
  },
  
  plugins: [
    'truffle-plugin-verify'
  ],
  
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY
  }

};