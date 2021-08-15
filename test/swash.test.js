const assert = require('assert');
const {parseEther} = require("@ethersproject/units");
const truffleAssert = require('truffle-assertions');
const {expect} = require("chai");
const swashContract = artifacts.require('SWASH');
const MockRecipientNotERC677Contract = artifacts.require('MockRecipientNotERC677Receiver');
const MockRecipientContract = artifacts.require('MockRecipient');
const MockRecipientReturnBoolContract = artifacts.require('MockRecipientReturnBool');
let accounts;
let _swash;
let _mockRecipientNotERC677Receiver;
let _mockRecipient;
let _mockRecipientReturnBool;
// "err" as bytes, induces a simulated error in MockRecipient.sol and MockRecipientReturnBool.sol
const errData = "0x657272";
beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    _swash = await swashContract.new({
        from: accounts[0]
        , gas: 6353793
    });
    _mockRecipientNotERC677Receiver = await MockRecipientNotERC677Contract.new({
        from: accounts[0]
        , gas: 6353793
    });
    _mockRecipient = await MockRecipientContract.new({
        from: accounts[0]
        , gas: 6353793
    });
    _mockRecipientReturnBool = await MockRecipientReturnBoolContract.new({
        from: accounts[0]
        , gas: 6353793
    });
})
describe('Token', () => {
    it('Deploys Token Contract', async () => {
        await swashContract.new({
            from: accounts[0]
            , gas: 6353793
        });
    });

    it('Burn', async () => {
        await _swash.burn('1000');
        const balanceAfter = await _swash.balanceOf(accounts[0]);
        assert.strictEqual(balanceAfter.toString(), '999999999999999999999999000');
    });
    it("transferAndCall triggers ERC677 callback for normal contracts", async () => {
        await truffleAssert.passes(
            _swash.transferAndCall(_mockRecipient.address, parseEther("1"), '0x6c6f6c')
        );
        await truffleAssert.fails(
            _swash.transferAndCall(_mockRecipient.address, parseEther("1"), errData)
            , truffleAssert.ErrorType.REVERT
        );
    });
    it("transferAndCall triggers ERC677 callback for old contracts", async () => {
        await truffleAssert.fails(
            _swash.transferAndCall(_mockRecipientNotERC677Receiver.address, parseEther("1"), '0x6c6f6c')
            , truffleAssert.ErrorType.REVERT
        );
        await truffleAssert.fails(
            _swash.transferAndCall(_mockRecipientNotERC677Receiver.address, parseEther("1"), errData)
            , truffleAssert.ErrorType.REVERT
        );
    });
    it("transferAndCall triggers ERC677 callback for contracts that return false on failure", async () => {
        await truffleAssert.passes(
            _swash.transferAndCall(_mockRecipientReturnBool.address, parseEther("1"), '0x6c6f6c')
        );
        await truffleAssert.passes(
            _swash.transferAndCall(_mockRecipientReturnBool.address, parseEther("1"), errData)
        );

        const txsBeforeBool = await _mockRecipientReturnBool.txCount();
        await _swash.transferAndCall(_mockRecipientReturnBool.address, parseEther("1"), '0x6c6f6c');
        await _swash.transferAndCall(_mockRecipientReturnBool.address, parseEther("1"), errData);
        const txsAfterBool = await _mockRecipientReturnBool.txCount();
        assert.strictEqual(txsAfterBool.toString(), "" + (+txsBeforeBool + 2));
    });

    it("transferAndCall just does normal transfer for non-contract accounts", async () => {
        const targetAddress = "0x0000000000000000000000000000000000000001";
        const balanceBefore = await _swash.balanceOf(targetAddress);
        const ownerBalanceBefore = await _swash.balanceOf(accounts[0]);
        await _swash.transferAndCall(targetAddress, parseEther("1"), "0x6c6f6c");
        const balanceAfter = await _swash.balanceOf(targetAddress);
        const ownerBalanceafter = await _swash.balanceOf(accounts[0]);

        expect(balanceAfter.sub(balanceBefore).toString()).to.equal(parseEther("1").toString());
        expect(ownerBalanceBefore.sub(ownerBalanceafter).toString()).to.equal(parseEther("1").toString());
    });
});
