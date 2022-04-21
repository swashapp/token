const assert = require('assert');
const truffleAssert = require('truffle-assertions');
const swashToken = artifacts.require('SWASHOnBsc')
const utils = require('web3-utils')
const {ethers} = require("ethers");

let minter
let nonMinter
const amount = utils.toWei('15')
let minterRole
contract('SWASH Token test on BSC', async accounts => {

    let owner
    let _swashToken

    beforeEach('init contracts for each test', async function () {
        minter = accounts[0]
        owner = accounts[0]
        nonMinter = accounts[1]
        //set owner as bridge
        _swashToken = await swashToken.new({from: owner})
        minterRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('MINTER_ROLE'));
        console.log('####################### minter role ############################')
        console.log(minterRole)
    })

    it('1- Mint token with non minter account', async () => {
        let balance = await _swashToken.balanceOf(minter);
        assert.equal(balance.toString(), '0')

        await truffleAssert.reverts(
            _swashToken.mint(minter, amount),
            "AccessControl: account 0xa7c90ef6f58b6826d76c8cc21ce501e0f76df24d is missing role 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6."
        );

        balance = await _swashToken.balanceOf(minter);
        assert.equal(balance.toString(), '0')

    })

    it('2- Mint token', async () => {
        let balance = await _swashToken.balanceOf(minter);
        assert.equal(balance.toString(), '0')

        console.log('==================== minter =================================')
        console.log(minter)


        await _swashToken.setMinter(minter);
        await _swashToken.mint(minter, amount);

        balance = await _swashToken.balanceOf(minter);
        assert.equal(balance.toString(), amount.toString())

    })

    it('3- Burn token with non minter account', async () => {
        let balance = await _swashToken.balanceOf(minter);
        assert.equal(balance.toString(), '0')

        await _swashToken.setMinter(minter);
        await _swashToken.mint(minter, amount);

        balance = await _swashToken.balanceOf(minter);
        assert.equal(balance.toString(), amount.toString())

        await _swashToken.revokeMinter(minter);
        await truffleAssert.reverts(
            _swashToken.burn(minter, amount),
            "AccessControl: account 0xa7c90ef6f58b6826d76c8cc21ce501e0f76df24d is missing role 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6."
        );

        balance = await _swashToken.balanceOf(minter);
        assert.equal(balance.toString(), amount.toString())

    })

    it('4- Burn token', async () => {
        let balance = await _swashToken.balanceOf(minter);
        assert.equal(balance.toString(), '0')

        console.log('==================== minter =================================')
        console.log(minter)


        await _swashToken.setMinter(minter);
        await _swashToken.mint(minter, amount);

        balance = await _swashToken.balanceOf(minter);
        assert.equal(balance.toString(), amount.toString())

        balance = await _swashToken.balanceOf(minter);
        assert.equal(balance.toString(), amount.toString())

        await _swashToken.burn(minter, amount)

        balance = await _swashToken.balanceOf(minter);
        assert.equal(balance.toString(), '0')

    })

    it('5- Swapin token with non minter account', async () => {
        let balance = await _swashToken.balanceOf(minter);
        assert.equal(balance.toString(), '0')

        await truffleAssert.reverts(
            _swashToken.Swapin('0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6', minter, amount),
            "AccessControl: account 0xa7c90ef6f58b6826d76c8cc21ce501e0f76df24d is missing role 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6."
        );

        balance = await _swashToken.balanceOf(minter);
        assert.equal(balance.toString(), '0')

    })

    it('6- Swapin token', async () => {
        let balance = await _swashToken.balanceOf(minter);
        assert.equal(balance.toString(), '0')

        console.log('==================== minter =================================')
        console.log(minter)


        await _swashToken.setMinter(minter);
        await _swashToken.Swapin('0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6', minter, amount);

        balance = await _swashToken.balanceOf(minter);
        assert.equal(balance.toString(), amount.toString())

    })

    it('7- Swapout token with non minter account', async () => {
        let balance = await _swashToken.balanceOf(minter);
        assert.equal(balance.toString(), '0')

        await _swashToken.setMinter(minter);
        await _swashToken.mint(minter, amount);

        balance = await _swashToken.balanceOf(minter);
        assert.equal(balance.toString(), amount.toString())

        await _swashToken.revokeMinter(minter);
        await _swashToken.Swapout(amount, minter);

        balance = await _swashToken.balanceOf(minter);
        assert.equal(balance.toString(), '0')

    })

    it('8- Swapout token', async () => {
        let balance = await _swashToken.balanceOf(minter);
        assert.equal(balance.toString(), '0')

        console.log('==================== minter =================================')
        console.log(minter)


        await _swashToken.setMinter(minter);
        await _swashToken.mint(minter, amount);

        balance = await _swashToken.balanceOf(minter);
        assert.equal(balance.toString(), amount.toString())

        balance = await _swashToken.balanceOf(minter);
        assert.equal(balance.toString(), amount.toString())

        await _swashToken.Swapout(amount, minter)

        balance = await _swashToken.balanceOf(minter);
        assert.equal(balance.toString(), '0')

    })


})