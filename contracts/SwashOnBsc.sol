// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ERC677.sol";
import "./IERC677Receiver.sol";

contract SWASHOnBsc is Ownable, ERC677, ERC20Permit, AccessControl {

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    event LogSwapin(bytes32 indexed txhash, address indexed account, uint amount);
    event LogSwapout(address indexed account, address indexed bindaddr, uint amount);

    constructor()  ERC20("Swash Token", "SWASH") ERC20Permit("SWASH") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function transferOwnership(address newOwner) public override onlyOwner {
        Ownable.transferOwnership(newOwner);
        setAdmin(newOwner);
    }

    function setMinter(address wallet) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(MINTER_ROLE, wallet);
    }

    function setAdmin(address wallet) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(DEFAULT_ADMIN_ROLE, wallet);
    }

    function revokeAdmin(address wallet) public onlyOwner {
        require(owner() != wallet, "Can not revoke owner");
        revokeRole(DEFAULT_ADMIN_ROLE, wallet);
    }

    function revokeMinter(address wallet) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(MINTER_ROLE, wallet);
    }

    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) returns (bool) {
        _mint(to, amount);
        return true;
    }

    function burn(uint256 amount) public virtual {
        _burn(_msgSender(), amount);
    }

    function burnFrom(address account, uint256 amount) public virtual {
        uint256 currentAllowance = allowance(account, _msgSender());
        require(currentAllowance >= amount, "ERC20: burn amount exceeds allowance");
    unchecked {
        _approve(account, _msgSender(), currentAllowance - amount);
    }
        _burn(account, amount);
    }

    function burn(address from, uint256 amount) external onlyRole(MINTER_ROLE) returns (bool) {
        require(from != address(0), "address(0x0)");
        _burn(from, amount);
        return true;
    }

    function Swapin(bytes32 txhash, address account, uint256 amount) public onlyRole(MINTER_ROLE) returns (bool) {
        _mint(account, amount);
        emit LogSwapin(txhash, account, amount);
        return true;
    }

    function Swapout(uint256 amount, address bindaddr) public returns (bool) {
        require(bindaddr != address(0), "address(0x0)");
        _burn(msg.sender, amount);
        emit LogSwapout(msg.sender, bindaddr, amount);
        return true;
    }
}
