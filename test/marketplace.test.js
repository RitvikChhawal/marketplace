// const { assert } = require("chai");
// const { Item } = require("react-bootstrap/lib/Breadcrumb");

const { assert } = require('chai');


// const { assert } = require("chai");
// const { default: Web3 } = require("web3");

const marketplace = artifacts.require('./marketplace.sol');

require('chai')
 .use(require('chai-as-promised'))
 .should()

contract('marketplace', ([deployer, seller, buyer]) => {
    let Marketplace
    before(async() => {
        Marketplace = await marketplace.deployed() 
    })

    describe('deployment' , async () => {
        it('deploys successfully', async () => {
            const address = await Marketplace.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })
        it('has a name', async() => {
            const name = await Marketplace.name()
            assert.equal(name, 'Ritviks Module')
        })
    })

    describe('Products' , async() => {
        let result, productCount

        before(async() => {
            result = await Marketplace.createProduct('iPhone X', web3.utils.toWei('1', 'Ether'), {from : seller}) 
            productCount = await Marketplace.productCount() 
        })

        it('creates products', async() => {
            //SUCCESS
            // const name = await Marketplace.name()
            assert.equal(productCount, 1)
            // console.log(result.logs);
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), productCount.toNumber(),'id is correct');
            assert.equal(event.name, 'iPhone X','name is correct');
            assert.equal(event.price, '1000000000000000000','price is correct');
            assert.equal(event.owner, seller, 'owner is correct');
            assert.equal(event.purchased, false,'purchased is correct');
            
            //FAILURE
            await await Marketplace.createProduct('', web3.utils.toWei('1', 'Ether'), { from : seller}).should.be.rejected;
            await await Marketplace.createProduct('iPhone X', 0, { from : seller}).should.be.rejected;
    
        })
        it('list products', async() => {
            //SUCCESS
            const product = await Marketplace.products(productCount);
            // assert.equal(productCount, 1)
            // console.log(result.logs);
            // const event = result.logs[0].args
            assert.equal(product.id.toNumber(), productCount.toNumber(),'id is correct');
            assert.equal(product.name, 'iPhone X','name is correct');
            assert.equal(product.price, '1000000000000000000','price is correct');
            assert.equal(product.owner, seller, 'owner is correct');
            assert.equal(product.purchased, false,'purchased is correct');
            //FAILURE
            // await await Marketplace.createProduct('', web3.utils.toWei('1', 'Ether'), { from : seller}).should.be.rejected;
            // await await Marketplace.createProduct('iPhone X', 0, { from : seller}).should.be.rejected;
    
        })
        it('sells products' , async() => {
            let oldsellerbalance 
            oldsellerbalance = await web3.eth.getBalance(seller)
            oldsellerbalance = new web3.utils.BN(oldsellerbalance)

            //SCUCESS BUYER MAKES The purchase
            result = await Marketplace.purchaseProduct(productCount , {from : buyer, value : web3.utils.toWei('1', 'Ether')})
            // console.log(result.logs);
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), productCount.toNumber(),'id is correct')
            assert.equal(event.name, 'iPhone X','name is correct')
            assert.equal(event.price, '1000000000000000000','price is correct')
            assert.equal(event.owner, buyer, 'owner is correct')
            assert.equal(event.purchased, true,'purchased is correct')

            let newsellerbalance 
            newsellerbalance = await web3.eth.getBalance(seller)
            newsellerbalance = new web3.utils.BN(newsellerbalance)

            let price
            price = web3.utils.toWei('1', 'Ether')
            price = new web3.utils.BN(price)

            // console.log(oldsellerbalance, newsellerbalance, price)
            const expectedBalance = oldsellerbalance.add(price)

            assert.equal(newsellerbalance.toString(), expectedBalance.toString())
            // failure : must have a valid product id
            await Marketplace.purchaseProduct(99 , {from: buyer, value : web3.utils.toWei('1', 'Ether')}).should.be.rejected;
            // buyer tries to buy  without enought ether
            await Marketplace.purchaseProduct(productCount , {from: buyer, value : web3.utils.toWei('0.5', 'Ether')}).should.be.rejected;
            // deployer trie to but the product i.e. product cannot be purchased twice
            await Marketplace.purchaseProduct(productCount , {from: deployer, value : web3.utils.toWei('1', 'Ether')}).should.be.rejected;
            // tries to buy again i.e. buyer cannot be the seller
            await Marketplace.purchaseProduct(productCount , {from: buyer, value : web3.utils.toWei('1', 'Ether')}).should.be.rejected;
                        
        })
    })
})