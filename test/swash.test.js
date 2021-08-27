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
let swashContract;
beforeEach(async () => {

    accounts = await ethers.getSigners();

    swashContract = await ethers.getContractFactory("SWASH");
    _swash = await swashContract.deploy(accounts[0].address);
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
        let _swashContract = await swashContract.deploy(accounts[0].address);
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
        await expect(_swash.transferAndCall(_mockRecipientNotERC677Receiver.address, parseEther("1"), '0x6c6f6c')).to.be.reverted
        await expect(_swash.transferAndCall(_mockRecipientNotERC677Receiver.address, parseEther("1"), errData)).to.be.reverted;
    });
    it("transferAndCall triggers ERC677 callback for contracts that return false on failure", async () => {
        await expect(_swash.transferAndCall(_mockRecipientReturnBool.address, parseEther("1"), '0x6c6f6c')).to.not.be.reverted;
        await expect(_swash.transferAndCall(_mockRecipientReturnBool.address, parseEther("1"), errData)).to.not.be.reverted;

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
describe('Token Transfer With New Changes', () => {
    it("Wallet To Wallet", async () => {
        await _swash.transferAndCall(accounts[1].address, parseEther("3"), "0x6c6f6c");
        await _swash.connect(accounts[1]).transferAndCall(accounts[2].address, parseEther("1"), "0x6c6f6c");
        const account1Balance = await _swash.balanceOf(accounts[1].address);
        const account2Balance = await _swash.balanceOf(accounts[2].address);
        expect(account1Balance.toString()).equal(parseEther("2").toString());
        expect(account2Balance.toString()).equal(parseEther("1").toString());
    });
    it("Inside Method To Wallet", async () => {
        const mockTokenHolderContract = await ethers.getContractFactory("MockTokenHolder");
        _tokenHolderContract = await mockTokenHolderContract.deploy(_swash.address);
        await _tokenHolderContract.deployed();
        await _swash.transfer(_tokenHolderContract.address, 100000);

        const mockTransferContract = await ethers.getContractFactory("MockTransfer");
        const _mockTransferContract = await mockTransferContract.deploy("DontTransfer",
            _tokenHolderContract.address, accounts[1].address, 0);
        await _mockTransferContract.deployed();

        await _mockTransferContract.transfer(accounts[2].address, 10); //inside method
        const account1Balance = await _swash.balanceOf(accounts[1].address);
        const account2Balance = await _swash.balanceOf(accounts[2].address);

        expect(account1Balance.toString()).equal('0');
        expect(account2Balance.toString()).equal('10');

        //check callback
        const txtCount = await _mockTransferContract.txCount();
        expect(txtCount, 'one callback must be occurred.').equal(1);
    });

    it("Inside Method To Contract", async () => {
        const mockTokenHolderContract = await ethers.getContractFactory("MockTokenHolder");
        const _tokenHolderContract = await mockTokenHolderContract.deploy(_swash.address);
        await _tokenHolderContract.deployed();
        await _swash.transfer(_tokenHolderContract.address, 100000);

        const mockTransferContract = await ethers.getContractFactory("MockTransfer");
        const _mockTransferContract = await mockTransferContract.deploy("DontTransfer",
            _tokenHolderContract.address, accounts[1].address, 0);
        await _mockTransferContract.deployed();

        await _mockTransferContract.transfer(_mockRecipient.address, 10); //inside method To Contract
        const account1Balance = await _swash.balanceOf(accounts[1].address);
        const mockRecipientBalance = await _swash.balanceOf(_mockRecipient.address);

        expect(account1Balance.toString()).equal('0');
        expect(mockRecipientBalance.toString()).equal('10');

        //check callback
        const txtCount = await _mockTransferContract.txCount();
        expect(txtCount, 'one callback must be occurred.').equal(1);
    });

    it("Inside Method To This", async () => {
        const mockTokenHolderContract = await ethers.getContractFactory("MockTokenHolder");
        const _tokenHolderContract = await mockTokenHolderContract.deploy(_swash.address);
        await _tokenHolderContract.deployed();
        await _swash.transfer(_tokenHolderContract.address, 100000);

        const mockTransferContract = await ethers.getContractFactory("MockTransfer");
        const _mockTransferContract = await mockTransferContract.deploy("DontTransfer",
            _tokenHolderContract.address, accounts[1].address, 0);
        await _mockTransferContract.deployed();

        await _mockTransferContract.internalTransfer(10); //inside method To This

        const account1Balance = await _swash.balanceOf(accounts[1].address);
        const thisBalance = await _swash.balanceOf(_mockTransferContract.address);

        expect(account1Balance.toString()).equal('0');
        expect(thisBalance.toString()).equal('10');

        //check callback
        const txtCount = await _mockTransferContract.txCount();
        expect(txtCount, 'two callback must be occurred.').equal(2);
    });

    it("Inside Constructor To Wallet", async () => {
        const mockTokenHolderContract = await ethers.getContractFactory("MockTokenHolder");
        const _tokenHolderContract = await mockTokenHolderContract.deploy(_swash.address);
        await _tokenHolderContract.deployed();
        await _swash.transfer(_tokenHolderContract.address, 100000);

        const mockTransferContract = await ethers.getContractFactory("MockTransfer");
        const _mockTransferContract = await mockTransferContract.deploy("TransferToWallet",
            _tokenHolderContract.address, accounts[2].address, 10);
        await _mockTransferContract.deployed();

        const account2Balance = await _swash.balanceOf(accounts[2].address);

        expect(account2Balance.toString()).equal('10');

        //check callback
        const txtCount = await _mockTransferContract.txCount();
        expect(txtCount, 'one callback must be occurred.').equal(1);
    });
    it("Inside Constructor To Contract", async () => {
        const mockTokenHolderContract = await ethers.getContractFactory("MockTokenHolder");
        const _tokenHolderContract = await mockTokenHolderContract.deploy(_swash.address);
        await _tokenHolderContract.deployed();
        await _swash.transfer(_tokenHolderContract.address, 100000);

        const mockTransferContract = await ethers.getContractFactory("MockTransfer");
        const _mockTransferContract = await mockTransferContract.deploy("TransferToContract",
            _tokenHolderContract.address, _mockRecipient.address, 100);
        await _mockTransferContract.deployed();

        const mockRecipientBalance = await _swash.balanceOf(_mockRecipient.address);

        expect(mockRecipientBalance.toString()).equal('100');

        //check callback
        const txtCount = await _mockTransferContract.txCount();
        expect(txtCount,'one callback must be occurred.').equal(1 );
    });
    it("Inside Constructor To This", async () => {
        const fakeAddress = "0x0000000000000000000000000000000000000001";
        const mockTokenHolderContract = await ethers.getContractFactory("MockTokenHolder");
        const _tokenHolderContract = await mockTokenHolderContract.deploy(_swash.address);
        await _tokenHolderContract.deployed();
        await _swash.transfer(_tokenHolderContract.address, 100000);

        const mockTransferContract = await ethers.getContractFactory("MockTransfer");
        const _mockTransferContract = await mockTransferContract.deploy("TransferToThis",
            _tokenHolderContract.address, fakeAddress, 1000);
        await _mockTransferContract.deployed();

        const mockTransferContractBalance = await _swash.balanceOf(_mockTransferContract.address);

        expect(mockTransferContractBalance.toString()).equal('1000');

        //check callback
        const txtCount = await _mockTransferContract.txCount();
        expect(txtCount, 'two callback must be occurred.').equal(2);
    });
});
