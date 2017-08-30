var Investment = artifacts.require("./Investment.sol");
var DebtCoverageCollector = artifacts.require("./DebtCoverageCollector.sol");

contract('Investment.sol', function (accounts) {
    it("should let send amount of eth, if contract token is declared", function () {
        var dccContract;
        var investmentContract;
        var initialBalance;
        var resultObj;
        var contractToken = "incg9jllaoaosdkasdokq8da5m";
        var investmentMeta = "{\"createdOn\":{\"epochSecond\":1503041193,\"nano\":165000000},\"updatedOn\":{\"epochSecond\":1503041193,\"nano\":165000000},\"id\":null,\"userId\":\"0dc6ced3-2f9c-440e-9ad5-012bbb49cb5a\",\"contractToken\":\"rlcg9jap4ubgcmn4dsqgq8da5m\",\"totalAmount\":0.7058963055125367,\"totalAmountEth\":23529876,\"investments\":[{\"createdOn\":{\"epochSecond\":1503041194,\"nano\":426000000},\"updatedOn\":{\"epochSecond\":1503041194,\"nano\":426000000},\"id\":null,\"invoiceId\":\"0dc6ced3-2f9c-440e-9ad5-012bbb49cb5a\",\"investmentId\":\"0dc6ced3-2f9c-440e-9ad5-012bbb49cb5a\",\"amount\":0.6011382024844396,\"amountEth\":20037940,\"repaidAmountEth\":0,\"status\":\"CURRENT\"},{\"createdOn\":{\"epochSecond\":1503041194,\"nano\":451000000},\"updatedOn\":{\"epochSecond\":1503041194,\"nano\":451000000},\"id\":null,\"invoiceId\":\"e163b535-ff79-4f20-ad9b-747b5bf3c6cc\",\"investmentId\":\"0dc6ced3-2f9c-440e-9ad5-012bbb49cb5a\",\"amount\":0.10475810302809707,\"amountEth\":3491936,\"repaidAmountEth\":0,\"status\":\"CURRENT\"}],\"status\":\"PENDING\"}";
        return DebtCoverageCollector.deployed().then(function (instance) {
            dccContract = instance;
            return instance.addContract(contractToken, investmentMeta, 10000000000, {from: accounts[0], gass: 3000000})
        }).then(function() {
            return Investment.deployed().then(function (instance) {
                investmentContract = instance;
                initialBalance = web3.eth.getBalance(web3.eth.accounts[0]);
                return investmentContract.sendCoin(contractToken, {from: accounts[1], value: web3.toWei(1, 'ether')});
            }).then(function (result) {
                resultObj = result;
                balance = web3.eth.getBalance(web3.eth.accounts[0]);
                assert.equal((balance - initialBalance) / 1000000000000000000, 1, "Balance of contract owner has to increase with 1 eth");
            });
        });
    });
});