// const { assert } = require("chai");
// const { Item } = require("react-bootstrap/lib/Breadcrumb");


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
    })
})