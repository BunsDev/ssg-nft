import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { ethers } from "ethers";

import twitterLogo from "../../assets/twitter-logo.svg";

import ssgNft from "../../utils/SSGNFT.json";

// Constants
const TWITTER_HANDLE = "todya_";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = "https://testnets.opensea.io/collection/ssg-nft";
const TOTAL_MINT_LIMIT = 169;

const CONTRACT_ADDRESS = "0x684751221d445456730Aa2faF19c34B07790f51e";
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
  const renderConnectUI = () => (
    <MainButton onClick={connectWallet}>Connect to Wallet</MainButton>
  );

  const renderMintUI = () => (
    <div>
      {isLoading ? (
        <span>Loading ...</span>
      ) : (
        <>
          <MainButton disabled={!!errorMsg} onClick={askContractToMintNft}>
            Mint NFT
          </MainButton>
          {errorMsg ? <ErrorMsg>{errorMsg}</ErrorMsg> : null}
        </>
      )}
    </div>
  );

  return (
    <Container>
      <Content>
        <LeftSide>
          <Title>Smooth Square Gradient NFT Collection</Title>
          <SubText>Price: FREE ✨ (+ gas)</SubText>

          <Actions>
            {currWallet === "" ? renderConnectUI() : renderMintUI()}
            <CollectionLink
              href={OPENSEA_LINK}
              target="_blank"
              rel="noreferrer"
            >
              View collection
            </CollectionLink>
          </Actions>

          <div>
            {nftLink ? (
              <a href={nftLink} target="_blank" rel="noreferrer">
                See your NFT 👀
              </a>
            ) : null}
          </div>

          <TwitterBlock>
            <TwLogo alt="Twitter Logo" src={twitterLogo} />
            <TwText>Built by</TwText>
            <TwLink href={TWITTER_LINK} target="_blank" rel="noreferrer">
              {`@${TWITTER_HANDLE}`}
            </TwLink>
          </TwitterBlock>
        </LeftSide>
        <RightSide>
          <BottomText>
            <NftCount>
              <Counter>
                {mintedAmount}/{TOTAL_MINT_LIMIT}
              </Counter>
              <BaseText>Number of minted NFTs </BaseText>
            </NftCount>
          </BottomText>
        </RightSide>
      </Content>
    </Container>
  );
};

export default App;

const Container = styled.div`
  height: 100vh;
  overflow: auto;
`;

const Content = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const LeftSide = styled.div`
  padding: 32px 25%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.h2`
  font-weight: 700;
  font-size: 50px;
  line-height: 56px;
  max-width: 380px;
  margin-bottom: 24px;
`;

const SubText = styled.h4`
  font-size: 24px;
  line-height: 28px;
  font-weight: 500;
`;

const baseBtn = css`
  display: block;
  border-radius: 8px;
  max-width: 269px;
  width: 100%;
  padding: 16px 20px;
  text-align: center;
  border: none;
  cursor: pointer;
  font-weight: 500;
  font-size: 16px;
  margin-bottom: 8px;
`;

const Actions = styled.div`
  margin: 24px 0;
`;

const MainButton = styled.button`
  ${baseBtn};
  background-color: #e92f9e;
  color: #fff;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CollectionLink = styled.a`
  ${baseBtn};
  background-color: #f4f4f4;
  text-decoration: none;
`;

const TwitterBlock = styled.div`
  display: flex;
  align-items: center;
`;

const TwLogo = styled.img`
  height: 30px;
  width: 30px;
`;

const TwText = styled.p`
  margin: 0 4px 0 8px;
`;

const TwLink = styled.a`
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const RightSide = styled.div`
  background: linear-gradient(
      342.2deg,
      rgba(233, 47, 158, 0.4) 11.76%,
      rgba(87, 123, 186, 0.4) 41.29%
    ),
    radial-gradient(60.76% 54.36% at 13.8% 8.5%, #e92f9e 0%, #577bba 100%);
  padding: 32px;
  display: flex;
`;

const BottomText = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
`;

const NftCount = styled.div`
  color: #fff;
`;

const Counter = styled.h3`
  font-size: 40px;
  margin-bottom: 8px;
  color: #fff;
`;

const BaseText = styled.p`
  font-size: 16px;
  color: #fff;
`;

const ErrorMsg = styled.div``;
