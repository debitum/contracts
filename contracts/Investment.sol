pragma solidity ^0.4.11;

import "./DebtCoverageCollector.sol";


contract Investment {

    address private mainOwner;
    DebtCoverageCollector private debtCoverageCollector;

    modifier onlyOwner() {
        if (msg.sender == mainOwner) _;
        else {
            throw;
        }
    }

    function Investment(address debtCoverageCollectorAddress) {
        debtCoverageCollector = DebtCoverageCollector(debtCoverageCollectorAddress);
        mainOwner = msg.sender;
    }

    function sendCoin(string contractToken) payable returns (bool){
        return debtCoverageCollector.sendCoin.value(msg.value)(contractToken, msg.sender);
    }

    function upgradeDebtCoverageCollector(address debtCoverageCollectorAddress) onlyOwner {
        debtCoverageCollector = DebtCoverageCollector(debtCoverageCollectorAddress);
    }

    function kill() onlyOwner {
        suicide(mainOwner);
    }

    function () payable {

    }


}