var RiskCommunity = artifacts.require("./RiskCommunity.sol");
var RiskAssessorRating =  artifacts.require("./StandardRiskAssessorRating.sol");

contract('RiskCommunity.sol', function (accounts) {

    it("Should throw let add new risk assessor", async function() {
        let community = await RiskCommunity.new();
        let registration = await community.register("Best risk assessor", "risk@assessor.org", "+911", {from: accounts[1], gass: 3000000});
        let ratingAddress = await community.ratingAddress(web3.eth.accounts[1], {from: accounts[1], gass: 3000000});
        let rating = await RiskAssessorRating.at(ratingAddress).rating({from: accounts[1], gass: 3000000});

        assert.equal(registration.logs[0].event, "MemberRegistered", "New assessor has to register successfully");
        assert.notEqual(ratingAddress, undefined, "Rating contract has to be build for new risk assessor");
        assert.equal(rating, "REGISTERED", "After registration user rating is equals to REGISTERED");
    });

    it("Assessor cannot register if he/she already belongs to community", async function() {
        let community = await RiskCommunity.new();
        await community.register("Best risk assessor", "risk@assessor.org", "+911", {from: accounts[1], gass: 3000000});
        var transferError;

        try {
            await community.register("Trying to pretend another assessor", "risk@assessor.org", "+911", {from: accounts[1], gass: 3000000});
        } catch (error) {
            transferError = error;
        }

        assert.notEqual(transferError, undefined, 'Error must be thrown');
    });

    it("Assessor can be rated only by community contract", async function() {
        let community = await RiskCommunity.new();
        await community.register("Best risk assessor", "risk@assessor.org", "+911", {from: accounts[1], gass: 3000000});
        let ratingAddress = await community.ratingAddress(web3.eth.accounts[1], {from: accounts[1], gass: 3000000});
        var transferError;
        try {
            await RiskAssessorRating.at(ratingAddress).setRating("The best", {from: accounts[1], gass: 3000000});
        } catch (error) {
            transferError = error;
        }

        await community.setRating(web3.eth.accounts[1], "Worse assessor", {from: accounts[0], gass: 3000000});
        let rating = await RiskAssessorRating.at(ratingAddress).rating({from: accounts[1], gass: 3000000});

        assert.notEqual(transferError, undefined, 'Error must be thrown');
        assert.equal(rating, "Worse assessor", "After registration user rating is equals to REGISTERED");
    });
});