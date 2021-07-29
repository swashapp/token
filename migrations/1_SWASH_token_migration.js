const swashToken = artifacts.require("SWASH");


module.exports = function (deployer) {
	deployer.deploy(swashToken);
};