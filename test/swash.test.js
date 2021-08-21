const {parseEther} = require("@ethersproject/units");
const {expect} = require("chai");

let accounts;
let _swash;
let _mockRecipientNotERC677Receiver;
let _mockRecipient;
let _mockRecipientReturnBool;
const {ethers} = require("hardhat");
// "err" as bytes, induces a simulated error in MockRecipient.sol and MockRecipientReturnBool.sol
const errData = "0x657272";
beforeEach(async () => {

    accounts = await ethers.getSigners();

    const swashContract = await ethers.getContractFactory("SWASH");
    _swash = await swashContract.deploy();
    await _swash.deployed();

    const mockRecipientNotERC677ReceiverContract = await ethers.getContractFactory("MockRecipientNotERC677Receiver");
    _mockRecipientNotERC677Receiver = await mockRecipientNotERC677ReceiverContract.deploy();
    await _mockRecipientNotERC677Receiver.deployed();

    const mockRecipientContractContract = await ethers.getContractFactory("MockRecipient");
    _mockRecipient = await mockRecipientContractContract.deploy();
    await _mockRecipient.deployed();


    const mockRecipientReturnBoolContract = await ethers.getContractFactory("MockRecipientReturnBool");
    _mockRecipientReturnBool = await mockRecipientReturnBoolContract.deploy();
    await _mockRecipientReturnBool.deployed();

})
describe('Token', () => {
    it('Deploys Token Contract', async () => {
        const swashContract = await ethers.getContractFactory("SWASH");
        let _swashContract = await swashContract.deploy()
        await _swashContract.deployed();
    });

    it('Burn', async () => {
        await _swash.connect(accounts[0]).burn('1000');
        const balanceAfter = await _swash.balanceOf(accounts[0].address);
        expect(balanceAfter.toString()).to.equal('999999999999999999999999000');
    });

    it("transferAndCall triggers ERC677 callback for normal contracts", async () => {
        await expect(_swash.transferAndCall(_mockRecipient.address, parseEther("1"), '0x6c6f6c')).to.not.be.reverted;
        await expect(_swash.transferAndCall(_mockRecipient.address, parseEther("1"), errData)).to.be.reverted;
    });
    it("transferAndCall triggers ERC677 callback for old contracts", async () => {
        await expect( _swash.transferAndCall(_mockRecipientNotERC677Receiver.address, parseEther("1"), '0x6c6f6c')).to.be.reverted
        await expect(_swash.transferAndCall(_mockRecipientNotERC677Receiver.address, parseEther("1"), errData)).to.be.reverted;
    });
    it("transferAndCall triggers ERC677 callback for contracts that return false on failure", async () => {
        await expect(_swash.transferAndCall(_mockRecipientReturnBool.address, parseEther("1"), '0x6c6f6c')).to.not.be.reverted;
        await expect( _swash.transferAndCall(_mockRecipientReturnBool.address, parseEther("1"), errData)).to.not.be.reverted;

        const txsBeforeBool = await _mockRecipientReturnBool.txCount();
        await _swash.transferAndCall(_mockRecipientReturnBool.address, parseEther("1"), '0x6c6f6c');
        await _swash.transferAndCall(_mockRecipientReturnBool.address, parseEther("1"), errData);
        const txsAfterBool = await _mockRecipientReturnBool.txCount();

        await expect(txsAfterBool.toString()).to.equal("" + (+txsBeforeBool + 2));
    });

    it("transferAndCall just does normal transfer for non-contract accounts", async () => {
        const targetAddress = "0x0000000000000000000000000000000000000001";
        const balanceBefore = await _swash.balanceOf(targetAddress);
        const ownerBalanceBefore = await _swash.balanceOf(accounts[0].address);
        await _swash.transferAndCall(targetAddress, parseEther("1"), "0x6c6f6c");
        const balanceAfter = await _swash.balanceOf(targetAddress);
        const ownerBalanceAfter = await _swash.balanceOf(accounts[0].address);

        expect(balanceAfter.sub(balanceBefore).toString()).to.equal(parseEther("1").toString());
        expect(ownerBalanceBefore.sub(ownerBalanceAfter).toString()).to.equal(parseEther("1").toString());
    });
});
