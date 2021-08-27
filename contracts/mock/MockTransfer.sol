pragma solidity 0.8.6;

import "./IMockTokenHolder.sol";
import "../IERC677.sol";
import "hardhat/console.sol";
import "../IERC677Receiver.sol";

contract MockTransfer is IERC677Receiver {
    address _mockTokenHolderAddress;
    uint public txCount;

    constructor (string memory actionType, address mockTokenHolderAddress, address tokenReceiverAddress, uint32 amount) {
        _mockTokenHolderAddress = mockTokenHolderAddress;
        if (keccak256(abi.encodePacked(actionType)) == keccak256("DontTransfer")) {
            return;
        }
        IMockTokenHolder(_mockTokenHolderAddress).getSomeToken(amount);
        if (keccak256(abi.encodePacked(actionType)) == keccak256("TransferToThis")) {
            console.log('TransferToThis');
            IERC677(IMockTokenHolder(_mockTokenHolderAddress).getTokenAddress()).transferAndCall(address(this), amount, "0x6c6f6c");
        } else {
            IERC677(IMockTokenHolder(_mockTokenHolderAddress).getTokenAddress()).transferAndCall(tokenReceiverAddress, amount, "0x6c6f6c");
        }
    }


    function transfer(address tokenReceiverAddress, uint32 amount) public {
        IMockTokenHolder(_mockTokenHolderAddress).getSomeToken(amount);
        IERC677(IMockTokenHolder(_mockTokenHolderAddress).getTokenAddress()).transferAndCall(tokenReceiverAddress, amount, "0x6c6f6c");
    }

    function internalTransfer(uint32 amount) public {
        IMockTokenHolder(_mockTokenHolderAddress).getSomeToken(amount);
        IERC677(IMockTokenHolder(_mockTokenHolderAddress).getTokenAddress()).transferAndCall(address(this), amount, "0x6c6f6c");
    }

    function onTokenTransfer(
        address _sender,
        uint256 _value,
        bytes calldata _data
    ) external override {
        txCount += 1;
        require(keccak256(_data) != keccak256("err"));
        //        console.log('MockTransfer txCount');
        //        console.log(txCount);
        // for testing: revert if passed "err"
    }
}
