// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "./ERC677.sol";
import "./IERC677Receiver.sol";

contract SWASH is ERC677, ERC20Permit, ERC20Burnable {

    /**
     * @dev After deploying the contract 1,000,000,000 SWASH token would be minted to the minter address
     * @param vault The vault address is a Gnosis Safe multisig address with six owners and three confirmations per transaction.
     */
    constructor(address vault) ERC20("Swash Token", "SWASH") ERC20Permit("SWASH") {
        _mint(vault, 10**27);
    }
}