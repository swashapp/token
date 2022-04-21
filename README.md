<h1 align="center">SWASH token Contract</h1>

> Smart contract for SWASH token. 

**Table of Contents**

- [Installation](#-installation)
- [Network Deployments](#-network-deployments)
- [License](#-license)


# Installation

Set up the development environment on your machine as follows.

As a prerequisite, you need:

- Node.js v12+
- npm

Clone the project and install all dependencies:

```bash
git clone https://github.com/swashapp/token.git
cd token/
```

## install truffle
```
npm i -g truffle
```


## install packages
```
npm i
```

## setup environment variables
In the root directory of the project create a file with name ```.env```. Then paste these parameters to the file and initialize them accordingly:

```
INFURA_TOKEN=<Token for connecting to Ethereum mainnet/testnet using infura provider>
MNEMONIC=<Contract owner's mnemonic backup phrase>
ETHERSCAN_API_KEY=<The Etherscan API Key which is used for publishing the source code on the Etherscan>
```

## to compile contracts
```
truffle compile
```

---
##SwashToken

# Network Deployments

You can deploy the contract locally, to Rinkeby, or to Ethereum mainnet.

## Deploy Locally (Ganache)

* In a separate terminal, start the testnet: `ganache-cli`
* In your main terminal, run: `truffle migrate --network development`

## Deploy to Rinkeby

* In your main terminal, run: `truffle migrate --network rinkeby`

## Deploy to mainnet

* In your main terminal, run: `truffle migrate --network mainnet`
---
##SwashTokenOnPolygon

## Deploy token

run `node .\scripts\deploy-tokenOnPolygon.js <mumbai/(matic/polygon)> <rootChainManager>`

---
##SwashTokenOnBSC

## Deploy token
first set accountPrivateKey = xxxxxxxxx

set gasPrice in \node_modules\@ethersproject\hardware-wallets\lib\ledger.js file

run `npx hardhat run --network bsc  .\scripts\deploy-tokenOnBSC-HW.js`

set rpc of multichain as admin and minter

---
# License

```
MIT License

```
