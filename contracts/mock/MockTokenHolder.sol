pragma solidity 0.8.6;

import "../SWASH.sol";
import "hardhat/console.sol";

contract MockTokenHolder {
    address  _tokenAddr;
    constructor (address tokenAddr) {
        _tokenAddr = tokenAddr;
    }

    function getSomeToken(uint256 amount) public {

        IERC677(_tokenAddr).transferAndCall(msg.sender, amount, "0x6c6f6c");

    }

    function getTokenAddress() public view returns (address tokenAddress) {
        return _tokenAddr;
    }

}
