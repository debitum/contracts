pragma solidity ^0.4.11;


import "./strings.sol";


contract DebtCoverageCollector {
    using strings for *;

    address private mainOwner;

    uint private integer_delimeter = 1000000;

    uint private fraction_delimeter = 10000;

    mapping (string => DebtContract) private debtContracts;

    mapping (string => InvoiceEntry) private paidInvoiceEntries;

    struct DebtContract {
        string token;
        address payer;
        uint amount;
        bool isPaid;
        bool exsists;
        uint256 paidAt;
        string investmentMeta;
    }

    struct InvoiceEntry {
        string contractToken;
        uint amount;
        bool isPaid;
        uint256 paidAt;
    }

    modifier onlyOwner() {
        if (msg.sender == mainOwner) _;
        else {
            UnauthorizedError(msg.sender, "User not authorized", now);
        }
    }

    event ContractAdded(string token, uint value, uint256 createdOn);

    event UnauthorizedError(address hacker, string message, uint256 createdOn);

    event TokenDoesNotExistsError(address hacker, string token, uint256 createdOn);

    event ContractAlreadyPaidError(address hacker, string token, uint256 createdOn);

    event BalanceIsNotEnoughError(uint256 createdOn);

    event PaymentDataCorruptedError(uint tokensSize, uint invoicesSize, uint payementsSize, uint256 createdOn);

    event ContractPaid(address sender, string token, uint ammount, uint256 createdOn);

    event InterestRateChanged(string token, uint newInterestRate, uint256 createdOn);

    event ContractAmountNotCorrectError(address hacker, string token, uint hasToBe, uint declared, uint256 createdOn);

    event ContractIsNotPaidError(string token, uint256 createdOn);

    event InvoiceEntryIsNotPaidError(string token, string invoiceId, uint256 createdOn);

    event InvoiceEntryPaid(string invoiceToken, uint amount, uint256 createdOn);

    event InvoiceAlreadyPaidError(string invoiceToken, uint256 createdOn);

    event BalanceIsNotEnoughToPayInterestError(string token, uint balance, uint interest, uint256 createdOn);

    event PaidContractDeleteError(string token, address investmentOwner,  uint256 createdOn);

    event ContractDeleted(string token, address investmentOwner, uint256 createdOn);

    function DebtCoverageCollector() payable {
        mainOwner = msg.sender;
    }

    function addContract(string token, string investmentMeta, uint value) onlyOwner {
        if (debtContracts[token].exsists == false) {
            debtContracts[token] = DebtContract(token, msg.sender, value, false, true, 0, investmentMeta);
        }
        else {
            var dContract = debtContracts[token];
            if (dContract.isPaid) {
                ContractAlreadyPaidError(msg.sender, token, now);
                return;
            }
            else {
                dContract.amount = value;
                dContract.investmentMeta = investmentMeta;
            }
        }
        ContractAdded(token, value, now);
    }

    function deleteContract(string tokens) onlyOwner {
        var tokenArr = splitTokens(tokens);

        for (uint i = 0; i < tokenArr.length; i++) {
            if (debtContracts[tokenArr[i]].paidAt != 0) {
                PaidContractDeleteError(tokenArr[i], debtContracts[tokenArr[i]].payer,  now);
            }

            if (debtContracts[tokenArr[i]].exsists == true) {
                ContractDeleted(tokenArr[i], debtContracts[tokenArr[i]].payer,  now);
                delete debtContracts[tokenArr[i]];
            }
        }
    }


    function getInvestmentMetaInfo(string token) constant onlyOwner returns (string) {
        if (debtContracts[token].exsists == false) {
            TokenDoesNotExistsError(msg.sender, token, now);
            return "";
        }
        else {
            return debtContracts[token].investmentMeta;
        }
    }


    function sendCoin(string contractToken) payable returns (bool){
        var amount = msg.value;
        if (debtContracts[contractToken].exsists == false) {
            TokenDoesNotExistsError(msg.sender, contractToken, now);
            returnMoney();
            return false;
        }

        if (debtContracts[contractToken].amount != convertAmountToDigit(amount)) {
            ContractAmountNotCorrectError(msg.sender, contractToken, debtContracts[contractToken].amount, convertAmountToDigit(amount), now);
            returnMoney();
            return false;
        }

        if (debtContracts[contractToken].isPaid) {
            ContractAlreadyPaidError(msg.sender, contractToken, now);
            returnMoney();
            return false;
        }

        payContract(contractToken, amount);

        return true;
    }


    function invoicePaymentAmountInfo(string invoiceToken) onlyOwner returns (uint) {
        return paidInvoiceEntries[invoiceToken].amount;
    }

    function invoicePaymentPaidAtInfo(string invoiceToken) onlyOwner returns (uint) {
        return paidInvoiceEntries[invoiceToken].paidAt;
    }

    function payForInvoices(string tokens, string invoiceEntries, uint[] pays) onlyOwner returns (bool) {
        var tokenArr = splitTokens(tokens);
        var invoiceArr = splitTokens(invoiceEntries);
        if (tokenArr.length != pays.length || invoiceArr.length != pays.length) {
            PaymentDataCorruptedError(tokenArr.length, invoiceArr.length, pays.length, now);
            return false;
        }
        else {
            for (uint i = 0; i < tokenArr.length; i++) {
                if (debtContracts[tokenArr[i]].paidAt == 0) {
                    InvoiceEntryIsNotPaidError(tokenArr[i], invoiceArr[i], now);
                }
                else {
                    if (getBalance() >= paymentAmount(pays[i])) {
                        payForInvoiceEntry(tokenArr[i], invoiceArr[i], pays[i]);
                    }
                    else {
                        BalanceIsNotEnoughToPayInterestError(tokenArr[i], getBalance(), paymentAmount(pays[i]), now);
                    }
                }
            }
        }

        return true;
    }

    function paymentAmount(uint _amount) private returns (uint) {
        return _amount * 1000000000000000000 / (integer_delimeter * fraction_delimeter);
    }

    function convertAmountToDigit(uint _amount) private returns (uint) {
        return _amount * (integer_delimeter * fraction_delimeter) / 1000000000000000000;
    }

    function payForInvoiceEntry(string contractToken, string invoiceToken, uint amount) private {
        if (paidInvoiceEntries[invoiceToken].isPaid == false) {
            debtContracts[contractToken].payer.transfer(paymentAmount(amount));
            paidInvoiceEntries[invoiceToken].contractToken = contractToken;
            paidInvoiceEntries[invoiceToken].isPaid = true;
            paidInvoiceEntries[invoiceToken].paidAt = now;
            paidInvoiceEntries[invoiceToken].amount = paymentAmount(amount);
            InvoiceEntryPaid(invoiceToken, paymentAmount(amount), now);
        }
        else {
            InvoiceAlreadyPaidError(invoiceToken, now);
        }
    }


    function payContract(string contractToken, uint amount) private {
        debtContracts[contractToken].payer = msg.sender;
        debtContracts[contractToken].paidAt = now;
        ContractPaid(msg.sender, contractToken, amount, now);
        mainOwner.transfer(amount);
    }

    function getBalance() constant returns (uint) {
        return this.balance;
    }

    function returnMoney() private {
        msg.sender.transfer(msg.value);
    }

    function AddEth() payable {

    }

    function kill() onlyOwner {
        suicide(mainOwner);
    }

    function splitTokens(string tokens) private returns (string[]) {

        var s = tokens.toSlice();
        var delim = ";".toSlice();
        var parts = new string[](s.count(delim) + 1);
        for (uint i = 0; i < parts.length; i++) {
            parts[i] = s.split(delim).toString();
        }

        return parts;

    }
}