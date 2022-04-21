const {ethers} = require("ethers");

const localProvider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
const mainnetProvider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/c941387bd4d8467285c24d75ad3574a4');
const rinkebyProvider = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/c941387bd4d8467285c24d75ad3574a4');
const ropstenProvider = new ethers.providers.JsonRpcProvider('https://ropsten.infura.io/v3/c941387bd4d8467285c24d75ad3574a4');
const xdaiProvider = new ethers.providers.JsonRpcProvider('https://rpc.xdaichain.com/');
const bscProvider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed1.defibit.io');
const bscTestProvider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');
const polygonProvider = new ethers.providers.JsonRpcProvider ('https://rpc.ankr.com/polygon');
const mumbaiProvider = new ethers.providers.JsonRpcProvider('https://matic-mumbai.chainstacklabs.com/');

function getProvider(network) {
    switch(network){
        case 'local':
            return localProvider;
        case 'mainnet':
            return mainnetProvider;
        case 'rinkeby':
            return rinkebyProvider;
        case 'ropsten':
            return ropstenProvider;
        case 'xdai':
            return xdaiProvider;
        case 'bsc':
            return bscProvider;
        case 'bsctest':
            return bscTestProvider;
        case 'polygon':
        case 'matic':
            return polygonProvider;
        case 'mumbai':
            return mumbaiProvider;
        default:
            throw new Error('Selected network not found!')

    }
}
module.exports = {
    getProvider:getProvider
}