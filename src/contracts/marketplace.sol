pragma solidity ^0.5.0;

contract marketplace{
    string public name;
    uint public productCount = 0;
    mapping(uint => Product) public products;

    struct Product{
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
    }
    event productCreated(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );
    event productPurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );
    constructor() public{
        name = "Ritviks Module";
    }
    function createProduct(string memory _name,uint _price) public{
        require(bytes(_name).length > 0);

        require(_price > 0);

        productCount++;

        products[productCount] = Product(productCount, _name, _price, msg.sender, false);

        emit productCreated(productCount, _name, _price, msg.sender, false);
    }
    function purchaseProduct(uint _id) public payable{
        //Fetch the product
        Product memory _product = products[_id];
        //fetch the owner
        address payable _seller = _product.owner;
        //make sure the product is valid
        require(_product.id > 0 && _product.id <= productCount);
        // check there are enought ether for the transaction 
        require(msg.value >= _product.price);
        // prodcct is not already purchased
        require(!_product.purchased);
        // check  buyer != seller
        require(_seller != msg.sender);
        //transfer the ownership to buyer        
        _product.owner = msg.sender;
        //mark as purchased
        _product.purchased = true;
        // update the product 
        products[_id] = _product;
        //pay the seller
        address(_seller).transfer(msg.value);
        //trigger the event
        emit productPurchased(productCount, _product.name, _product.price, msg.sender, true);

    }


}



