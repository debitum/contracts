pragma solidity ^0.4.11;

import './interface/RiskAssessorRating.sol';

contract StandardRiskAssessorRating is RiskAssessorRating {

    address private assessor;
    address private communityAddress;
    string private assessorFullname;
    string private assessorPhone;
    string private assessorEmail;
    string private assessorRating;

    modifier onlyCommunity() {
        if(msg.sender != communityAddress) throw;
        else _;
    }

    function StandardRiskAssessorRating(address _assessor, string _fullname, string _phone, string _email) {
        assessor = _assessor;
        communityAddress = msg.sender;
        assessorFullname = _fullname;
        assessorPhone = _phone;
        assessorEmail = _email;
    }

    function community() constant returns (address) {
        return communityAddress;
    }


    function fullname() constant returns (string) {
        return assessorFullname;
    }

    function phone() constant returns (string) {
        return assessorPhone;
    }

    function email() constant returns (string) {
        return assessorEmail;
    }

    function rating() constant returns (string) {
        return assessorRating;
    }

    function setRating(string _rating) onlyCommunity returns (bool) {
        assessorRating = _rating;
    }

    function kill() onlyCommunity {
        suicide(communityAddress);
    }

}
