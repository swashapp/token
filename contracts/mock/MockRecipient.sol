// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "../IERC677Receiver.sol";

contract MockRecipient is IERC677Receiver {
    uint public txCount;

    function onTokenTransfer(
        address _sender,
        uint256 _value,
        bytes calldata _data
    ) external override {
        txCount += 1;
        require(keccak256(_data) != keccak256("err"));
        // for testing: revert if passed "err"
    }
}
