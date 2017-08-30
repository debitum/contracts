
var DebtCoverageCollector = artifacts.require("./DebtCoverageCollector.sol");
var Strings = artifacts.require("./strings.sol");
var Investment = artifacts.require("./Investment.sol");

module.exports = function (deployer) {
    deployer.deploy(Strings);
    deployer.link(Strings, DebtCoverageCollector);
    deployer.deploy(DebtCoverageCollector).then(function(){
        return deployer.deploy(Investment, DebtCoverageCollector.address);
    });
};
