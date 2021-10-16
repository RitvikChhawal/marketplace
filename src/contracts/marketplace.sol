pragma solidity ^0.5.0;

contract marketplace{
    string public name;
    uint public productCount = 0;
    mapping(uint => Product) public products;

    struct Product{
        uint id;
        string name;
        uint price;
        address owner;
        bool purchased;
    }
    event productCreated(
        uint id,
        string name,
        uint price,
        address owner,
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


}


