var DebtCoverageCollector = artifacts.require("./DebtCoverageCollector.sol");


contract('DebtCoverageCollector.sol', function (accounts) {
    it("should let send amount of eth, if contract token is declared", function () {
        var meta;
        var initialBalance;
        var resultObj;
        var contractToken = "rlcg9jap4ubgcmn4dsqgq8da5m";
        var investmentMeta = "{\"createdOn\":{\"epochSecond\":1503041193,\"nano\":165000000},\"updatedOn\":{\"epochSecond\":1503041193,\"nano\":165000000},\"id\":null,\"userId\":\"0dc6ced3-2f9c-440e-9ad5-012bbb49cb5a\",\"contractToken\":\"rlcg9jap4ubgcmn4dsqgq8da5m\",\"totalAmount\":0.7058963055125367,\"totalAmountEth\":23529876,\"investments\":[{\"createdOn\":{\"epochSecond\":1503041194,\"nano\":426000000},\"updatedOn\":{\"epochSecond\":1503041194,\"nano\":426000000},\"id\":null,\"invoiceId\":\"0dc6ced3-2f9c-440e-9ad5-012bbb49cb5a\",\"investmentId\":\"0dc6ced3-2f9c-440e-9ad5-012bbb49cb5a\",\"amount\":0.6011382024844396,\"amountEth\":20037940,\"repaidAmountEth\":0,\"status\":\"CURRENT\"},{\"createdOn\":{\"epochSecond\":1503041194,\"nano\":451000000},\"updatedOn\":{\"epochSecond\":1503041194,\"nano\":451000000},\"id\":null,\"invoiceId\":\"e163b535-ff79-4f20-ad9b-747b5bf3c6cc\",\"investmentId\":\"0dc6ced3-2f9c-440e-9ad5-012bbb49cb5a\",\"amount\":0.10475810302809707,\"amountEth\":3491936,\"repaidAmountEth\":0,\"status\":\"CURRENT\"}],\"status\":\"PENDING\"}";
        return DebtCoverageCollector.deployed().then(function (instance) {
            meta = instance;
            return instance.addContract(contractToken, investmentMeta, 10000000000, {from: accounts[0], gass: 3000000})
        }).then(function () {
            initialBalance = web3.eth.getBalance(web3.eth.accounts[0]);
            return meta.sendCoin(contractToken, {from: accounts[1], value: web3.toWei(1, 'ether')});
        }).then(function (result) {
            resultObj = result;
            balance = web3.eth.getBalance(web3.eth.accounts[0]);
            assert.equal(resultObj.logs[0].event, "ContractPaid", "Event that contract was paid has to be published");
            assert.equal((balance - initialBalance) / 1000000000000000000, 1, "Balance of contract owner has to be equal to 1");
        });
    });

    it("should let send amount of eth, if contract was not defined", function () {
        var meta;
        return DebtCoverageCollector.deployed().then(function (instance) {
            meta = instance;
            return meta.sendCoin("NOT_EXISTING_TOKEN", {from: accounts[1], value: web3.toWei(10, 'ether')});
        }).then(function (result) {
            assert.equal(result.logs[0].event, "TokenDoesNotExistsError", "Event that token does not exists has to be published");
        });
    });

    it("should not let send amount of eth, if contract eth amount is not correct", function () {
        var meta;
        var initialBalance;
        var resultObj;
        var contractToken = "rlcg9jap4ubgcmn4dsqgq8da5m";
        var investmentMeta = "{\"createdOn\":{\"epochSecond\":1503041193,\"nano\":165000000},\"updatedOn\":{\"epochSecond\":1503041193,\"nano\":165000000},\"id\":null,\"userId\":\"0dc6ced3-2f9c-440e-9ad5-012bbb49cb5a\",\"contractToken\":\"rlcg9jap4ubgcmn4dsqgq8da5m\",\"totalAmount\":0.7058963055125367,\"totalAmountEth\":23529876,\"investments\":[{\"createdOn\":{\"epochSecond\":1503041194,\"nano\":426000000},\"updatedOn\":{\"epochSecond\":1503041194,\"nano\":426000000},\"id\":null,\"invoiceId\":\"0dc6ced3-2f9c-440e-9ad5-012bbb49cb5a\",\"investmentId\":\"0dc6ced3-2f9c-440e-9ad5-012bbb49cb5a\",\"amount\":0.6011382024844396,\"amountEth\":20037940,\"repaidAmountEth\":0,\"status\":\"CURRENT\"},{\"createdOn\":{\"epochSecond\":1503041194,\"nano\":451000000},\"updatedOn\":{\"epochSecond\":1503041194,\"nano\":451000000},\"id\":null,\"invoiceId\":\"e163b535-ff79-4f20-ad9b-747b5bf3c6cc\",\"investmentId\":\"0dc6ced3-2f9c-440e-9ad5-012bbb49cb5a\",\"amount\":0.10475810302809707,\"amountEth\":3491936,\"repaidAmountEth\":0,\"status\":\"CURRENT\"}],\"status\":\"PENDING\"}";
        return DebtCoverageCollector.deployed().then(function (instance) {
            meta = instance;
            return instance.addContract(contractToken, investmentMeta, 10000000000, {from: accounts[0], gass: 3000000})
        }).then(function () {
            initialBalance = web3.eth.getBalance(web3.eth.accounts[0]);
            return meta.sendCoin(contractToken, {from: accounts[1], value: web3.toWei(10, 'ether')});
        }).then(function (result) {
            resultObj = result;
            balance =  web3.eth.getBalance(web3.eth.accounts[0]);
            assert.equal(resultObj.logs[0].event, "ContractAmountNotCorrectError", "Event that contract amount which client wants to send is not correct has to be published");
            assert.equal((balance - initialBalance), 0, "Owners eth in wallet has not increased");
        });
    });

    it("should let check investment meta info of contract for owner", function () {
        var meta;
        var contractToken = "rlcg9jap4ubgcmn4dsqgq8da5m";
        var investmentMeta = "{\"createdOn\":{\"epochSecond\":1503041193,\"nano\":165000000},\"updatedOn\":{\"epochSecond\":1503041193,\"nano\":165000000},\"id\":null,\"userId\":\"0dc6ced3-2f9c-440e-9ad5-012bbb49cb5a\",\"contractToken\":\"rlcg9jap4ubgcmn4dsqgq8da5m\",\"totalAmount\":0.7058963055125367,\"totalAmountEth\":23529876,\"investments\":[{\"createdOn\":{\"epochSecond\":1503041194,\"nano\":426000000},\"updatedOn\":{\"epochSecond\":1503041194,\"nano\":426000000},\"id\":null,\"invoiceId\":\"0dc6ced3-2f9c-440e-9ad5-012bbb49cb5a\",\"investmentId\":\"0dc6ced3-2f9c-440e-9ad5-012bbb49cb5a\",\"amount\":0.6011382024844396,\"amountEth\":20037940,\"repaidAmountEth\":0,\"status\":\"CURRENT\"},{\"createdOn\":{\"epochSecond\":1503041194,\"nano\":451000000},\"updatedOn\":{\"epochSecond\":1503041194,\"nano\":451000000},\"id\":null,\"invoiceId\":\"e163b535-ff79-4f20-ad9b-747b5bf3c6cc\",\"investmentId\":\"0dc6ced3-2f9c-440e-9ad5-012bbb49cb5a\",\"amount\":0.10475810302809707,\"amountEth\":3491936,\"repaidAmountEth\":0,\"status\":\"CURRENT\"}],\"status\":\"PENDING\"}";
        return DebtCoverageCollector.deployed().then(function (instance) {
            meta = instance;
            return instance.addContract(contractToken, investmentMeta, 10000000000, {from: accounts[0], gass: 3000000})
        }).then(function () {
            return meta.getInvestmentMetaInfo(contractToken, {from: accounts[0], gass: 3000000});
        }).then(function (result) {
            balance =  web3.eth.getBalance(web3.eth.accounts[0]);
            assert.equal(result, investmentMeta, "Owner retrieved investment meta info by contract token");
        });
    });

    it("should let repay investments of clients when loans repaid", function () {
        var contract;
        var client1Balance;
        var client2Balance;
        var contractToken1 = "rldddddddubgcmn4dsqgq8da5m";
        var contractToken2 = "rlcg9ssslasd2j9dasdasdakd0";
        var investmentMeta = "{\"createdOn\":{\"epochSecond\":1503041193,\"nano\":165000000},\"updatedOn\":{\"epochSecond\":1503041193,\"nano\":165000000},\"id\":null,\"userId\":\"0dc6ced3-2f9c-440e-9ad5-012bbb49cb5a\",\"contractToken\":\"rlcg9jap4ubgcmn4dsqgq8da5m\",\"totalAmount\":0.7058963055125367,\"totalAmountEth\":23529876,\"investments\":[{\"createdOn\":{\"epochSecond\":1503041194,\"nano\":426000000},\"updatedOn\":{\"epochSecond\":1503041194,\"nano\":426000000},\"id\":null,\"invoiceId\":\"0dc6ced3-2f9c-440e-9ad5-012bbb49cb5a\",\"investmentId\":\"0dc6ced3-2f9c-440e-9ad5-012bbb49cb5a\",\"amount\":0.6011382024844396,\"amountEth\":20037940,\"repaidAmountEth\":0,\"status\":\"CURRENT\"},{\"createdOn\":{\"epochSecond\":1503041194,\"nano\":451000000},\"updatedOn\":{\"epochSecond\":1503041194,\"nano\":451000000},\"id\":null,\"invoiceId\":\"e163b535-ff79-4f20-ad9b-747b5bf3c6cc\",\"investmentId\":\"0dc6ced3-2f9c-440e-9ad5-012bbb49cb5a\",\"amount\":0.10475810302809707,\"amountEth\":3491936,\"repaidAmountEth\":0,\"status\":\"CURRENT\"}],\"status\":\"PENDING\"}";
        return DebtCoverageCollector.deployed().then(function (instance) {
            contract = instance;
            return instance.addContract(contractToken1, investmentMeta, 10000000000, {from: accounts[0], gass: 3000000})
        }).then(function (resultObj) {
            assert.equal(resultObj.logs[0].event, "ContractAdded", "Event that contract added has to be published");

            return contract.addContract(contractToken2, investmentMeta, 20000000000, {from: accounts[0], gass: 3000000})
        }).then(function (resultObj) {
            assert.equal(resultObj.logs[0].event, "ContractAdded", "Event that contract added has to be published");

            return contract.sendCoin(contractToken1, {from: accounts[1], value: web3.toWei(1, 'ether')});
        }).then(function (resultObj) {
            assert.equal(resultObj.logs[0].event, "ContractPaid", "Event that contract was paid has to be published");

            client1Balance = web3.eth.getBalance(web3.eth.accounts[1]);
            return contract.sendCoin(contractToken2, {from: accounts[2], value: web3.toWei(2, 'ether')});
        }).then(function (resultObj) {
            assert.equal(resultObj.logs[0].event, "ContractPaid", "Event that contract was paid has to be published");

            client2Balance = web3.eth.getBalance(web3.eth.accounts[2]);
            var pays = new Array(2);
            pays[0] = 10100000000;
            pays[1] = 20200000000;
            contract.AddEth.sendTransaction(
                {
                    from: web3.eth.accounts[0],
                    to: contract.address,
                    value: web3.toWei(4, 'ether'),
                }
            );
            return contract.payForInvoices(contractToken1 + ";" + contractToken2, "e173b535-ff79-4f20-ad9b-747b5bf3c6cc;0dc62ed3-2f9c-440e-9a12-0555bb49cb5a", pays, {from: accounts[0], gass: 3000000});
        }).then(function () {
            assert.equal((web3.eth.getBalance(web3.eth.accounts[1]) - client1Balance) / 1000000000000000000, 1.01, "Clients 1 balance should increase by 0.01 ether");
            assert.equal((web3.eth.getBalance(web3.eth.accounts[2]) - client2Balance) / 1000000000000000000, 2.02, "Clients 2 balance should increase by 0.02 ether");
        });
    });

    it("should not repay investments if client didn't pay for investment contract", function () {
        var contract;
        var client1Balance;
        var client2Balance;
        var contractToken1 = "apsdlapsldasjdjoskwasd9dpa";
        var contractToken2 = "rlcg9japlasd2j9asidjasidis";
        var investmentMeta = "{\"createdOn\":{\"epochSecond\":1503041193,\"nano\":165000000},\"updatedOn\":{\"epochSecond\":1503041193,\"nano\":165000000},\"id\":null,\"userId\":\"0dc6ced3-2f9c-440e-9ad5-012bbb49cb5a\",\"contractToken\":\"rlcg9jap4ubgcmn4dsqgq8da5m\",\"totalAmount\":0.7058963055125367,\"totalAmountEth\":23529876,\"investments\":[{\"createdOn\":{\"epochSecond\":1503041194,\"nano\":426000000},\"updatedOn\":{\"epochSecond\":1503041194,\"nano\":426000000},\"id\":null,\"invoiceId\":\"0dc6ced3-2f9c-440e-9ad5-012bbb49cb5a\",\"investmentId\":\"0dc6ced3-2f9c-440e-9ad5-012bbb49cb5a\",\"amount\":0.6011382024844396,\"amountEth\":20037940,\"repaidAmountEth\":0,\"status\":\"CURRENT\"},{\"createdOn\":{\"epochSecond\":1503041194,\"nano\":451000000},\"updatedOn\":{\"epochSecond\":1503041194,\"nano\":451000000},\"id\":null,\"invoiceId\":\"e163b535-ff79-4f20-ad9b-747b5bf3c6cc\",\"investmentId\":\"0dc6ced3-2f9c-440e-9ad5-012bbb49cb5a\",\"amount\":0.10475810302809707,\"amountEth\":3491936,\"repaidAmountEth\":0,\"status\":\"CURRENT\"}],\"status\":\"PENDING\"}";
        return DebtCoverageCollector.deployed().then(function (instance) {
            contract = instance;
            client2Balance = web3.eth.getBalance(web3.eth.accounts[2]);
            return instance.addContract(contractToken1, investmentMeta, 10000000000, {from: accounts[0], gass: 3000000})
        }).then(function () {
            return contract.addContract(contractToken2, investmentMeta, 20000000000, {from: accounts[0], gass: 3000000})
        }).then(function () {
            return contract.sendCoin(contractToken1, {from: accounts[1], value: web3.toWei(1, 'ether')});
        }).then(function () {
            client1Balance = web3.eth.getBalance(web3.eth.accounts[1]);
            var pays = new Array(2);
            pays[0] = 10100000000;
            pays[1] = 20200000000;
            contract.AddEth.sendTransaction(
                {
                    from: web3.eth.accounts[0],
                    to: contract.address,
                    value: web3.toWei(4, 'ether'),
                }
            );
            return contract.payForInvoices(contractToken1 + ";" + contractToken2, "e163b165-ff79-4f20-ad9b-747b5bf3c6cc;0dc62e13-2f9c-440e-9ad5-012bbb49cb5a", pays, {from: accounts[0], gass: 3000000});
        }).then(function (resultObj) {
            assert.equal((web3.eth.getBalance(web3.eth.accounts[1]) - client1Balance) / 1000000000000000000, 1.01, "Clients 1 balance should increase by 0.01 ether");
            assert.equal((web3.eth.getBalance(web3.eth.accounts[2]) - client2Balance) / 1000000000000000000, 0, "Clients 2 balance didn't increase");
            assert.equal(resultObj.logs[1].event, "InvoiceEntryIsNotPaidError", "Event for investment invoice entry client 2 didn't pay has to be published");
        });
    });

    it("should not repay investments if client already got payment", function () {
        var contract;
        var client1Balance;
        var pays = new Array(1);
        pays[0] = 10100000000;
        var contractToken = "apsdlapasdkd3332skwasd9dpa";
        var invoiceToken = "e163b535-ff79-4f20-ad9b-747b5bf3c6cc";
        var investmentMeta = "{\"createdOn\":{\"epochSecond\":1503041193,\"nano\":165000000},\"updatedOn\":{\"epochSecond\":1503041193,\"nano\":165000000},\"id\":null,\"userId\":\"0dc6ced3-2f9c-440e-9ad5-012bbb49cb5a\",\"contractToken\":\"rlcg9jap4ubgcmn4dsqgq8da5m\",\"totalAmount\":0.7058963055125367,\"totalAmountEth\":23529876,\"investments\":[{\"createdOn\":{\"epochSecond\":1503041194,\"nano\":426000000},\"updatedOn\":{\"epochSecond\":1503041194,\"nano\":426000000},\"id\":null,\"invoiceId\":\"0dc6ced3-2f9c-440e-9ad5-012bbb49cb5a\",\"investmentId\":\"0dc6ced3-2f9c-440e-9ad5-012bbb49cb5a\",\"amount\":0.6011382024844396,\"amountEth\":20037940,\"repaidAmountEth\":0,\"status\":\"CURRENT\"},{\"createdOn\":{\"epochSecond\":1503041194,\"nano\":451000000},\"updatedOn\":{\"epochSecond\":1503041194,\"nano\":451000000},\"id\":null,\"invoiceId\":\"e163b535-ff79-4f20-ad9b-747b5bf3c6cc\",\"investmentId\":\"0dc6ced3-2f9c-440e-9ad5-012bbb49cb5a\",\"amount\":0.10475810302809707,\"amountEth\":3491936,\"repaidAmountEth\":0,\"status\":\"CURRENT\"}],\"status\":\"PENDING\"}";
        return DebtCoverageCollector.deployed().then(function (instance) {
            contract = instance;
            return instance.addContract(contractToken, investmentMeta, 10000000000, {from: accounts[0], gass: 3000000})
        }).then(function () {
            return contract.sendCoin(contractToken, {from: accounts[1], value: web3.toWei(1, 'ether')});
        }).then(function () {
            client1Balance = web3.eth.getBalance(web3.eth.accounts[1]);

            contract.AddEth.sendTransaction(
                {
                    from: web3.eth.accounts[0],
                    to: contract.address,
                    value: web3.toWei(4, 'ether'),
                }
            );
            return contract.payForInvoices(contractToken , invoiceToken, pays, {from: accounts[0], gass: 3000000});
        }).then(function (resultObj) {
            assert.equal((web3.eth.getBalance(web3.eth.accounts[1]) - client1Balance) / 1000000000000000000, 1.01, "Clients 1 balance should increase by 0.01 ether");
            assert.equal(resultObj.logs[0].event, "InvoiceEntryPaid", "Event for investment invoice entry was paid has to be published");

            client1Balance = web3.eth.getBalance(web3.eth.accounts[1]);
            return contract.payForInvoices(contractToken, invoiceToken, pays, {from: accounts[0], gass: 3000000});
        }).then(function (resultObj) {
            assert.equal((web3.eth.getBalance(web3.eth.accounts[1]) - client1Balance) / 1000000000000000000, 0, "Clients 1 balance has not increased after second loan return");
            assert.equal(resultObj.logs[0].event, "InvoiceAlreadyPaidError", "Event for investment invoice entry was paid has to be published");
        });
    });

    it("owner of contract should be able to get information about invoice repay after payment was proceeded", function () {
        var contract;
        var client1Balance;
        var pays = new Array(1);
        pays[0] = 10100000000;
        var contractToken = "apsdkasdfkasdfp2skwasd9dpa";
        var invoiceToken = "aldk3ka5-ff79-4f20-ad9b-747asdk116cc";
        var investmentMeta = "{\"createdOn\":{\"epochSecond\":1503041193,\"nano\":165000000},\"updatedOn\":{\"epochSecond\":1503041193,\"nano\":165000000},\"id\":null,\"userId\":\"0dc6ced3-2f9c-440e-9ad5-012bbb49cb5a\",\"contractToken\":\"rlcg9jap4ubgcmn4dsqgq8da5m\",\"totalAmount\":0.7058963055125367,\"totalAmountEth\":23529876,\"investments\":[{\"createdOn\":{\"epochSecond\":1503041194,\"nano\":426000000},\"updatedOn\":{\"epochSecond\":1503041194,\"nano\":426000000},\"id\":null,\"invoiceId\":\"0dc6ced3-2f9c-440e-9ad5-012bbb49cb5a\",\"investmentId\":\"0dc6ced3-2f9c-440e-9ad5-012bbb49cb5a\",\"amount\":0.6011382024844396,\"amountEth\":20037940,\"repaidAmountEth\":0,\"status\":\"CURRENT\"},{\"createdOn\":{\"epochSecond\":1503041194,\"nano\":451000000},\"updatedOn\":{\"epochSecond\":1503041194,\"nano\":451000000},\"id\":null,\"invoiceId\":\"e163b535-ff79-4f20-ad9b-747b5bf3c6cc\",\"investmentId\":\"0dc6ced3-2f9c-440e-9ad5-012bbb49cb5a\",\"amount\":0.10475810302809707,\"amountEth\":3491936,\"repaidAmountEth\":0,\"status\":\"CURRENT\"}],\"status\":\"PENDING\"}";
        return DebtCoverageCollector.deployed().then(function (instance) {
            contract = instance;
            return instance.addContract(contractToken, investmentMeta, 10000000000, {from: accounts[0], gass: 3000000})
        }).then(function () {
            return contract.sendCoin(contractToken, {from: accounts[1], value: web3.toWei(1, 'ether')});
        }).then(function () {
            client1Balance = web3.eth.getBalance(web3.eth.accounts[1]);

            contract.AddEth.sendTransaction(
                {
                    from: web3.eth.accounts[0],
                    to: contract.address,
                    value: web3.toWei(4, 'ether'),
                }
            );
            return contract.payForInvoices(contractToken , invoiceToken, pays, {from: accounts[0], gass: 3000000});
        }).then(function () {
            return contract.invoicePaymentAmountInfo.call(invoiceToken, {from: accounts[0], gass: 3000000});
        }).then(function (invoicePaymentInfo) {
            assert.equal(invoicePaymentInfo.toNumber(), 1010000000000000000, "Owner gets info about repaid invoice amount");
        }).then(function () {
            return contract.invoicePaymentPaidAtInfo.call(invoiceToken, {from: accounts[0], gass: 3000000});
        }).then(function (invoicePaymentInfo) {
            assert.isTrue(invoicePaymentInfo.toNumber() > 0, "Owner gets info about repaid invoice date and time");
        });
    });

    it("unpaid contracts are deleted", function () {
        var contract;
        var contractToken = "rld1232asdijf9123jagq8da5m";

        var investmentMeta = "{\"createdOn\":{\"epochSecond\":1503041193,\"nano\":165000000}}";

        return DebtCoverageCollector.deployed().then(function (instance) {
            contract = instance;
            return instance.addContract(contractToken, investmentMeta, 10000000000, {from: accounts[0], gass: 3000000})
        }).then(function () {
            return contract.deleteContract(contractToken, {from: accounts[0], gass: 3000000});
        }).then(function (resultObj) {
            assert.equal(resultObj.logs[0].event, "ContractDeleted", "Event that contract was deleted has to be published");
            return contract.sendCoin(contractToken, {from: accounts[1], value: web3.toWei(1, 'ether')});
        }).then(function(resultObj){
            assert.equal(resultObj.logs[0].event, "TokenDoesNotExistsError", "After contract is deleted user should not be able to delete it");
        });

    });

});
