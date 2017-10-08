pragma solidity ^0.4.11;

import './interface/iEC23Receiver.sol';


contract ERC23 {
    function transfer(address to, uint value, bytes data) returns (bool ok);
    function transferFrom(address from, address to, uint value, bytes data) returns (bool ok);
}

contract RiskAssessment is ERC23Receiver {

    ERC23 private debiumToken;
    string private assetId;
    address private mainOwner;

    mapping (address => bool) private supportedTokens;
    mapping (address => uint) private proposedPrices;

    event ProposedPrice(address _proposer, uint _value);

    function RiskAssessment(address _mainTokenAddress, string _assetId) {
        supportedTokens[_mainTokenAddress] = true;
        debiumToken = ERC23(_mainTokenAddress);
        mainOwner = msg.sender;
        assetId = _assetId;
    }

    function tokenFallback(address _sender, address _origin, uint _value, bytes _data) returns (bool ok) {
        if (!supportsToken(ERC23(msg.sender))) return false;


        return true;
    }

    /* Proposed price for risk assessment.
     * Proposal could only be offerd by authenticated user of risk management group.
     * Keep in mind that decimal delimiter is equal to 18
     */
    function proposePrice(uint _value) returns(bool) {

        return true;
    }

    /* Asset identifier which needs risk assessment */
    function getAssetId() constant returns(string) {
        return assetId;
    }

    function supportsToken(ERC23 token) constant returns (bool) {
        return supportedTokens[token];
    }

}