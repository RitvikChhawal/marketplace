import React, { Component } from 'react';
import Web3 from 'web3';
import logo from '../logo.png';
import './App.css';
import marketplace from '../abis/marketplace.json'
import Navbar from './Navbar'
import Main from './Main'

class App extends Component {
  async componentWillMount(){
    await this.loadWeb3()
    // console.log(window.web3)
    await this.loadBlockchainData()
  }
 
  async loadWeb3(){
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()

    }
    else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider)     
    }
    else{
      window.alert('Non-Ethereum browser detected. You should install Metamask')
    }
  }
  async loadBlockchainData(){
    const web3 = window.web3
    //load account 
    const accounts = await web3.eth.getAccounts()
    this.setState({account : accounts[0]})
    const networkID = await web3.eth.net.getId()
    const networkData  = marketplace.networks[networkID]
    if(networkData){
      const Marketplace = web3.eth.Contract(marketplace.abi, networkData.address)
      this.setState({Marketplace})
      const productCount = await Marketplace.methods.productCount().call()
      // console.log(productCount.toString())
      this.setState({productCount})
      //load products
      for(var i = 1 ; i <= productCount; i++){
        const product = await Marketplace.methods.products(i).call();
        this.setState({
          products: [...this.state.products, product]
        })
      }
      this.setState({loading : false})
      // console.log(this.state.products)
    }else{
      window.alert('Marketplace contract not deployed to detected network')
    }
    // console.log(networkID)
    // const abi = marketplace.abi
    // const address = marketplace.networks[networkID].address
    // const Marketplace = web3.eth.Contract(abi,address)
    //console.log(accounts) 
  }

  constructor(props){
    super(props)
    this.state = {
      account: '',
      productCount: 0,
      products: [],
      loading: true
    }
    this.createProduct = this.createProduct.bind(this)
    this.purchaseProduct = this.purchaseProduct.bind(this)

  }
  createProduct(name,price){
    this.setState({loading: true})
    this.state.Marketplace.methods.createProduct(name,price).send({from: this.state.account})
    .once('receipt',(receipt) => {
      this.setState({loading : false})
    } )
  }
  purchaseProduct(id,price){
    this.setState({loading: true})
    this.state.Marketplace.methods.purchaseProduct(id).send({from: this.state.account, value:price})
    .once('receipt',(receipt) => {
      this.setState({loading : false})
    } )
  }
  
  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className = "container-fluid mt-5">
          <div className = "row">
          <main role="main" className="col-lg-12 d-flex">
              { this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <Main 
                products = {this.state.products} 
                createProduct={this.createProduct} 
                purchaseProduct={this.purchaseProduct} />
              }
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
