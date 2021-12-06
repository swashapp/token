// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./SWASH.sol";

contract SwashOnPolygon is SWASH, Ownable {
    address public sideChainManager;

    constructor(address initialSideChainManager) SWASH() {
        setSideChainManager(initialSideChainManager);
    }

    function setSideChainManager(address newRootChainManager) public onlyOwner {
        sideChainManager = newRootChainManager;
    }

    /**
     * When tokens are bridged from mainnet, perform a "mint" and "transferAndCall" to activate
     *   the receiving contract's ERC677 onTokenTransfer callback
     * Equal amount of tokens got locked in RootChainManager on the mainnet side
     */
    function deposit(address user, bytes calldata depositData) external {
        require(_msgSender() == sideChainManager, "error_onlyBridge");
        uint256 amount = abi.decode(depositData, (uint256));

        // emits two Transfer events: 0x0 -> sideChainManager -> user
        _mint(sideChainManager, amount);
        transferAndCall(user, amount, depositData);
    }

    /**
     * When returning to mainnet, it's enough to simply burn the tokens on the Polygon side
     */
    function withdraw(uint256 amount) external {
        _burn(_msgSender(), amount);
    }
}