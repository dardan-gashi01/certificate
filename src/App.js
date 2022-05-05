import './App.css';
import React, {useEffect, useState} from 'react';
import { ethers } from "ethers";
import abi from './utils/certificate.json';
import ipfs from './ipfs'
import {create} from 'ipfs-http-client'
import {Buffer} from 'buffer';

const client = create("https://ipfs.infura.io:5001/api/v0");

function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [image, setImage] = useState("");
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [year, setYear] = useState('');
  const [certificate, setCertificates] = useState([]);
  const contractAddress = '0x87b1d760F4C10713e58559257314c49118A04342';
  const contractABI = abi.abi;

  //checking if the wallet is connected
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

  
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }
  //connecting to the wallet so we use in our button
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  //write to blockchain when the user creates the certificate
  const createCertificate = async (certificate) => {
    try{
      const { ethereum } = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const tx = await contract.createCertificate(image, title, artist, year);
        await tx.wait();
        console.log("Transaction Hash:", tx.hash);
        alert("Certificate Created! refresh page to see it!");
      }
    }catch(err){
      console.error(err);
    }
  }
//get the certificate from the blockchain
  const getAllCertificates = async () => {
    try{
      const { ethereum } = window;
      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const certificates = await contract.getCertificate();
        console.log("Certificates:", certificates);

        let allCertificates = [];

        certificates.forEach(certificate => {
          allCertificates.push({
            picture: certificate.image,
            Title: certificate.title,
            Artist: certificate.artist,
            Year: certificate.year
          });
        });

        setCertificates(allCertificates);
      }
    }catch(err){
      console.error(err);
    }
  }

  
  useEffect(() => {
    getAllCertificates();
  })
  
  
  
  const handleSubmit = (e) => {
    e.preventDefault();
    createCertificate(certificate);
    console.log(image, title, artist, year);
  };
  
  


  /******
   * try to make the ipfs upload work but was messing up somewhere in the code
   */
  /*
  const handleImage = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    console.log(reader);
    const file = e.target.files[0];
    console.log(file);
    reader.onloadend = () => {
      setImage(reader.result);
      console.log(reader.result);
    }
    reader.readAsDataURL(file);
    console.log(image);
  }
  


  
  const handleSubmit = (e) => {
    e.preventDefault();
    client.add(Buffer.from(image, 'base64'), (err, result) => {
      if (err) {  console.error(err); }
      console.log(result);
      const ipfsHash = result[0].hash;
      console.log(ipfsHash);
      createCertificate(ipfsHash, title, artist, year);
      console.log(ipfsHash, title, artist, year);

    });
  }
  */
  
  
  return (
    <div className="App">
      connect to the Rinkeby testnet to try this out fully
      {!currentAccount ? (
          <button className="connectWallet" onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <div>Connected</div>
        )}
      Create certificate
      <form className = 'form'  onSubmit={handleSubmit}>
        <div className='labels'>
          <div>images   <input id = 'image' className='box' type='file' value={image} onChange={(e) => {setImage(e.target.value)}}/></div>
          <div>title   <textarea id = 'title' className='box' placeholder='Enter the title' value={title} onChange={(e) => {setTitle(e.target.value) }} /></div>
          <div>artist   <textarea id = 'artist' className='box' placeholder='Enter the artist' value={artist} onChange={(e) => {setArtist(e.target.value) }} /></div>
          <div>year   <textarea id = 'year' className='box' placeholder='Enter the year' value={year} onChange={(e) => {setYear(e.target.value) }} /></div>
        </div>
        <button className='button' type='submit'>Create certificate</button>
      </form> 

      <center>    
      <div className='certificates'>
        Certificates stored on-chain
          {certificate.map((certificate, index) => {
            return (
              
              <div key={index} className='certificate'>
                {/*}
                <div className='image'>
                  <img src={certificate.picture}/>
                </div>
                */}
                <div className='info'>
                  <div className='images'>Image URI: {certificate.picture}</div>
                  <div className='title'>Title: {certificate.Title}</div>
                  <div className='artist'>Artist: {certificate.Artist}</div>
                  <div className='year'>Year: {certificate.Year}</div>
                </div>
              </div>
              
            )
          }
          )}
      </div>
      </center>
    </div>
  );
}


export default App;
