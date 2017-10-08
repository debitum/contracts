pragma solidity ^0.4.11;

contract Community {

    function approvedMember(address _member) constant returns (bool);

    function status(address _member) constant returns (string);

    function register(string _fullname, string _email, string _phone) returns(bool);

    function removeMember(address _member) returns (bool);

    function approve(address _member) returns (bool);

    function ratingAddress(address _member) constant returns (address);

    event MemberRegistered(address _memberAddress, string _fullname, string _email, string _phone);

    event MemberRemoved(address _memberAddress);

    event MemberApproved(address _memberAddress);
}