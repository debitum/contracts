pragma solidity ^0.4.8;

import './IERC20Token.sol';

contract ERC23Token is iERC20Token {
    function transfer(address to, uint value, bytes data) returns (bool ok);
    function transferFrom(address from, address to, uint value, bytes data) returns (bool ok);
}