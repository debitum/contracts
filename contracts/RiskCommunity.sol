pragma solidity ^0.4.11;

import './interface/iEC23Receiver.sol';

import './interface/iERC23Token.sol';

import './RiskAssessment.sol';

import './StandardRiskAssessorRating.sol';

import './interface/Community.sol';


contract RiskCommunity is ERC23Receiver, Community {

    mapping (address => bool) private supportedTokens;
    mapping (address => RiskManager) private riskManagers;
    mapping (address => StandardRiskAssessorRating) private assessorRatings;
    ERC23Token private debiumToken;
    address private mainOwner;


    Tkn tkn;

    struct Tkn {
        address addr;
        address sender;
        address origin;
        uint256 value;
        bytes data;
        bytes4 sig;
    }

    struct RiskManager {
        address addr;
        string fullname;
        string email;
        string phone;
        string status;

    }

    function RiskCommunity(address mainTokenAddress) {
        supportedTokens[mainTokenAddress] = true;
        debiumToken = ERC23Token(mainTokenAddress);
        mainOwner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender == mainOwner) _;
        else {
            throw;
        }
    }

    function tokenFallback(address _sender, address _origin, uint _value, bytes _data) returns (bool ok) {
        if (!supportsToken(ERC23Token(msg.sender))) return false;

        // Problem: This will do a store which is expensive gas wise. Find a way to keep it in memory.
        tkn = Tkn(msg.sender, _sender, _origin, _value, _data, getSig(_data));
        __isTokenFallback = true;
        if (!address(this).delegatecall(_data)) return false;

        // avoid doing an overwrite to .token, which would be more expensive
        // makes accessing .tkn values outside tokenPayable functions unsafe
        __isTokenFallback = false;

        return true;
    }

    function register(string fullname, string email, string phone) returns(bool) {
        if(riskManagers[msg.sender].addr != 0x0) throw;

        riskManagers[msg.sender].addr = msg.sender;
        riskManagers[msg.sender].fullname = fullname;
        riskManagers[msg.sender].email = email;
        riskManagers[msg.sender].phone = phone;
        riskManagers[msg.sender].status = "REGISTERED";

        MemberRegistered(msg.sender, fullname, email, phone);
        assessorRatings[msg.sender] = new StandardRiskAssessorRating(msg.sender, fullname, phone, email);
        assessorRatings[msg.sender].setRating("REGISTERED");
        return true;
    }

    function approve(address _assessor) onlyOwner returns (bool){
        if(riskManagers[_assessor].addr == 0x0) throw;

        riskManagers[_assessor].status = "APPROVED";
        assessorRatings[msg.sender].setRating("APPROVED");

        MemberApproved(_assessor);
        return true;
    }

    function setRating(address _assessor, string rating) onlyOwner returns (bool){
        if(riskManagers[_assessor].addr == 0x0) throw;

        assessorRatings[_assessor].setRating(rating);
        return true;
    }

    function removeMember(address _assessor) onlyOwner returns (bool){
        if(riskManagers[_assessor].addr == 0x0) throw;

        delete riskManagers[_assessor];
        StandardRiskAssessorRating(riskManagers[_assessor].addr).kill();
        MemberRemoved(_assessor);

        return true;
    }

    function ratingAddress(address _assessor) constant returns (address){
        return address(assessorRatings[_assessor]);
    }

    function approvedMember(address _address) constant returns (bool) {
        return riskManagers[_address].addr != 0x0;
    }

    function status(address _assessor) constant returns (string) {
        return riskManagers[msg.sender].status;
    }

    function payTokens(address _to, uint amount) onlyOwner returns(bool){
        return debiumToken.transfer(_to, amount);
    }

    function payTokens(address _token, address _to, uint amount) onlyOwner returns(bool){
        return iERC20Token(_token).transfer(_to, amount);
    }

    function getSig(bytes _data) private returns (bytes4 sig) {
        uint l = _data.length < 4 ? _data.length : 4;
        for (uint i = 0; i < l; i++) {
            sig = bytes4(uint(sig) + uint(_data[i]) * (2 ** (8 * (l - 1 - i))));
        }
    }

    bool __isTokenFallback;

    modifier tokenPayable {
        if (!__isTokenFallback) throw;
        _;
    }



    function supportsToken(ERC23Token token) constant returns (bool) {
        return supportedTokens[token];
    }
}