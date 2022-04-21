const assert = require('assert');
const truffleAssert = require('truffle-assertions');
const swashToken = artifacts.require('SwashOnPolygon')
const utils = require('web3-utils')

let senderReceiver
const amount = utils.toWei('15')

contract('SWASH Token test on polygon', async accounts => {

    let owner
    let _swashToken

    beforeEach('init contracts for each test', async function () {
        senderReceiver = accounts[1]
        owner = accounts[0]
        //set owner as bridge
        _swashToken = await swashToken.new(owner, {from: owner})
    })


    it('Normal deposit', async () => {
        let balance =  await _swashToken.balanceOf(senderReceiver);
        assert.equal(balance.toString(), '0')

        console.log(_swashToken === undefined || _swashToken === null)
        console.log(senderReceiver)
        console.log(amount)

        await _swashToken.deposit(senderReceiver, utils.encodePacked(amount));

        balance =  await _swashToken.balanceOf(senderReceiver);
        assert.equal(balance.toString(), amount.toString())

    })

    it("only bridge is allowed to deposit", async () => {
        // await expect(
        //     hardhatStaking3month.connect(stakerWallet).stake(amount)
        // ).to.revertedWith("Error: bad timing for the request")

        await truffleAssert.reverts(
            _swashToken.deposit(senderReceiver, utils.encodePacked(amount), {from: senderReceiver}),
            "error_onlyBridge"
        );
    })

    it('Normal Withdraw', async () => {
        let balance =  await _swashToken.balanceOf(senderReceiver);
        assert.equal(balance.toString(), '0')

        console.log(_swashToken === undefined || _swashToken === null)
        console.log(senderReceiver)
        console.log(amount)

        await _swashToken.deposit(senderReceiver, utils.encodePacked(amount));
        balance =  await _swashToken.balanceOf(senderReceiver);
        assert.equal(balance.toString(), amount.toString())

        await _swashToken.withdraw(amount, {from: senderReceiver});
        balance =  await _swashToken.balanceOf(senderReceiver);
        assert.equal(balance.toString(), '0')

    })


})