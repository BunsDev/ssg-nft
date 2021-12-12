import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import "./App.css";
import twitterLogo from "../../assets/twitter-logo.svg";

import ssgNft from "../../utils/SSGNFT.json";

// Constants
const TWITTER_HANDLE = "todya_";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = "https://testnets.opensea.io/collection/ssg-nft";
const TOTAL_MINT_LIMIT = 169;

const CONTRACT_ADDRESS = "0xc86e06392d6E77a21AcF84f2C7307C02b09d6B73";
// String, hex code of the chainId of the Rinkebey test network
const rinkebyChainId = "0x4";

const App = () => {
  const [currWallet, setCurrWallet] = useState("");
  const [mintedAmount, setMintedAmount] = useState(0);
  const [nftLink, setNftLink] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    let chainId = await ethereum.request({ method: "eth_chainId" });
    console.log("Connected to chain " + chainId);

    if (chainId !== rinkebyChainId) {
      setErrorMsg("You are not connected to the Rinkeby Test Network!");
      return;
    }

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrWallet(account);

      // Setup listener for EXISTING wallet
      setupEventListener();
    } else {
      console.log("No authorized account found");
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Please install a wallet");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrWallet(accounts[0]);

      // Setup listener for NEW wallet
      setupEventListener();
    } catch (err) {
      console.log(err);
    }
  };

  // Setup event listener
  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          ssgNft.abi,
          signer
        );

        // Capture event
        connectedContract.on("nftMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          setNftLink(
            `https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
          );
        });

        console.log("Setup event listener");
      } else {
        console.log("Ethereum Obj doesn't exist");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;
      setErrorMsg("");

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        //Create connection to our contract
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          ssgNft.abi,
          signer
        );

        if (mintedAmount <= TOTAL_MINT_LIMIT) {
          console.log("Going to pop wallet now to pay gas...");
          let nftTxn = await connectedContract.mintNFT();

          setIsLoading(true);
          console.log("Mining...please wait.");
          await nftTxn.wait();

          console.log(
            `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
          );
          setIsLoading(false);
        } else {
          console.log("Whoops, we ran out of NFTs! Soz");
        }
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const calculateTotalMintedNfts = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        //Create connection to our contract
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          ssgNft.abi,
          signer
        );

        const totalMinted = await connectedContract.getMintedNfts();
        const formatted = totalMinted.toNumber();

        setMintedAmount(formatted);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    calculateTotalMintedNfts();
  }, [checkIfWalletIsConnected]);

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      Connect to Wallet
    </button>
  );

  const renderMintUI = () => (
    <div>
      {errorMsg ? (
        <p className="errorMsg">{errorMsg}</p>
      ) : (
        <>
          {isLoading ? (
            <span>Loading</span>
          ) : (
            <button
              onClick={askContractToMintNft}
              className="cta-button mint-button connect-wallet-button"
            >
              Mint NFT
            </button>
          )}
          <p>Price: FREE ✨ (+ gas)</p>
        </>
      )}
    </div>
  );

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">
            (S)mooth (S)quare (G)radient NFT Collection
          </p>
          <p className="sub-text">Unique blend of colours</p>
          {currWallet === "" ? renderNotConnectedContainer() : renderMintUI()}
        </div>
        <div>
          {nftLink ? (
            <a href={nftLink} target="_blank" rel="noreferrer">
              See your NFT 👀
            </a>
          ) : null}
        </div>
        <div className="">
          <p>
            Number of minted NFTs: {mintedAmount}/{TOTAL_MINT_LIMIT}
          </p>
          <a href={OPENSEA_LINK} target="_blank" rel="noreferrer">
            🌊 View collection on OpeanSea{" "}
          </a>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
