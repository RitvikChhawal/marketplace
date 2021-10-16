const marketplace = artifacts.require("marketplace");

module.exports = function(deployer) {
  deployer.deploy(marketplace);
};
