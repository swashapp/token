const path = require('path');
const swashToken = artifacts.require("SWASH");
require('dotenv').config(path.resolve(__dirname, '../.env'));


module.exports = function (deployer) {
	deployer.deploy(swashToken, process.env.VAULT);
};