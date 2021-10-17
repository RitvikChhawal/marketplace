import React, { Component } from 'react';
import Web3 from 'web3';
import logo from '../logo.png';
import './App.css';
import marketplace from '../abis/marketplace.json'

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
      console.log(Marketplace)
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
      account: ' ',
      productCount: 0,
      products: [],
      loading: true
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dapp University
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={logo} className="App-logo" alt="logo" />
                </a>
                <h1>Dapp University Starter Kit</h1>
                <p>
                  Edit <code>src/components/App.js</code> and save to reload.
                </p>
                <a
                  className="App-link"
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LEARN BLOCKCHAIN <u><b>NOW! </b></u>
                </a>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
