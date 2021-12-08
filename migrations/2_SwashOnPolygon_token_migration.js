const swashToken = artifacts.require("SwashOnPolygon");


module.exports = function (deployer) {
	deployer.deploy(swashToken, "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa");
};