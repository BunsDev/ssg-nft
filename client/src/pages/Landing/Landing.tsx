import { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { useNavigate } from "react-router-dom";
import { ethers, Contract } from "ethers";

import twitterLogo from "../../assets/twitter-logo.svg";
import cautionIcon from "../../assets/caution.svg";

import ssgNft from "../../utils/SSGNFT.json";
import { useNftContext } from "../../utils/nftContext";

import {
  TWITTER_HANDLE,
  TWITTER_LINK,
  OPENSEA_LINK,
  TOTAL_MINT_LIMIT,
  CONTRACT_ADDRESS,
  RINKEBY_ID,
} from "../../constants";

export const Landing = () => {
  const [currWallet, setCurrWallet] = useState("");
  const [nftContract, setNftContract] = useState<Contract | null>(null);

  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setNftLink, totalMinted, setTotalMinted } = useNftContext();

  let navigate = useNavigate();

  const networkSwitch = async (chainId: string) => {
    const { ethereum } = window;

    await ethereum.request({ method: "eth_chainId" });
    console.log("Connected to chain " + chainId);

    if (chainId !== RINKEBY_ID) {
      setErrorMsg("Select Rinkeby network");
    } else {
      setErrorMsg("");
    }
  };

  useEffect(() => {
    window.ethereum.on("chainChanged", networkSwitch);

    return () => window.ethereum.removeListener("chainChanged", networkSwitch);
  }, []);

  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ssgNft.abi,
        signer
      );

      setNftContract(contract);
    } else {
      console.log("Ethereum object not found");
    }
  }, []);

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install a wallet");
      return;
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found a connected account:", account);
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
      // Capture event
      nftContract?.on("nftMinted", (from, tokenId) => {
        console.log(from, tokenId.toNumber());
        console.log("link generated!");

        setIsLoading(false);
        const nftLink = `https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`;
        setNftLink(nftLink);
        navigate("../success");
      });
    } catch (err) {
      console.log(err);
    }
  };

  const askContractToMintNft = async () => {
    try {
      if (totalMinted <= TOTAL_MINT_LIMIT) {
        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await nftContract?.mintNFT();

        setIsLoading(true);
        console.log("Mining...please wait.");
        await nftTxn.wait();

        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );
      } else {
        console.log("Whoops, we ran out of NFTs! Soz");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const calculateTotalMintedNfts = async () => {
    try {
      const totalMinted = await nftContract?.getMintedNfts();
      const formatted = totalMinted.toNumber();

      setTotalMinted(formatted);
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
    <>
      {isLoading ? (
        <MainButton disabled>Loading...</MainButton>
      ) : (
        <>
          <MainButton disabled={!!errorMsg} onClick={askContractToMintNft}>
            Mint NFT
          </MainButton>
          {errorMsg ? (
            <ErrorBlock>
              <img alt="caution icon" src={cautionIcon} />
              <ErrorMessage>{errorMsg}</ErrorMessage>
            </ErrorBlock>
          ) : null}
        </>
      )}
    </>
  );

  return (
    <Container>
      <Content>
        <LeftSide>
          <LeftContent>
            <Title>Smooth Square Gradient NFT Collection</Title>
          </LeftContent>
          <BottomText>
            <NftCount>
              <Counter>
                {totalMinted}/{TOTAL_MINT_LIMIT}
              </Counter>
              <BaseText>Number of minted NFTs </BaseText>
            </NftCount>
          </BottomText>
        </LeftSide>
        <RightSide>
          <RightContent>
            <SubText>Mint price: Free</SubText>
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
          </RightContent>
          <TwitterBlock>
            <TwLogo alt="Twitter Logo" src={twitterLogo} />
            <TwText>Built by</TwText>
            <TwLink href={TWITTER_LINK} target="_blank" rel="noreferrer">
              {`@${TWITTER_HANDLE}`}
            </TwLink>
          </TwitterBlock>
        </RightSide>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  overflow: auto;
`;

const Content = styled.div`
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const LeftSide = styled.div`
  padding: 32px;
  display: grid;
  grid-template-rows: 1fr auto;

  background: linear-gradient(
      342.2deg,
      rgba(233, 47, 158, 0.4) 11.76%,
      rgba(87, 123, 186, 0.4) 41.29%
    ),
    radial-gradient(60.76% 54.36% at 13.8% 8.5%, #e92f9e 0%, #577bba 100%);
`;

const contentWrap = css`
  justify-self: center;
  align-self: center;
  display: grid;
`;

const LeftContent = styled.div`
  ${contentWrap}
`;

const RightContent = styled.div`
  ${contentWrap};
  width: 269px;
`;

const Title = styled.h2`
  font-weight: 700;
  font-size: 48px;
  line-height: 56px;
  max-width: 380px;
  margin-bottom: 24px;
  color: #fff;
`;

const SubText = styled.h4`
  font-size: 24px;
  line-height: 28px;
  font-weight: 500;
  margin-bottom: 16px;
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

const Actions = styled.div``;

const MainButton = styled.button`
  ${baseBtn};
  background-color: #e92f9e;
  color: #fff;

  &:hover {
    background-color: #bc247f;
  }

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
  height: 16px;
  width: 16px;
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
  padding: 32px;
  display: grid;
  grid-template-rows: 1fr auto;
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

const ErrorBlock = styled.div`
  margin-bottom: 12px;
  display: flex;
  align-items: center;
`;

const ErrorMessage = styled.span`
  color: #e92f9e;
  margin-left: 10px;
  font-size: 16px;
`;
