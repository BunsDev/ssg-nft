import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

import { TOTAL_MINT_LIMIT } from "../../constants";
import backIcon from "../../assets/back-arrow.svg";
import thumbsUpIcon from "../../assets/thumbs-up.svg";
import { useNftContext } from "../../utils/nftContext";

export const Success = () => {
  const { nftLink, totalMinted } = useNftContext();

  return (
    <Container>
      <Content>
        <LeftSide>
          <StyledLink to="/">
            <img alt="back arrow icon" src={backIcon} />
            <span>Back</span>
          </StyledLink>
          <LeftContent>
            <img alt="thumbs up icon" src={thumbsUpIcon} />
            <Title>Yay, your mint has been succesful!</Title>
            <NftLink target="_blank" rel="noreferrer" href={nftLink}>
              View my NFT
            </NftLink>
          </LeftContent>
        </LeftSide>
        <RightSide>
          <BottomText>
            <NftCount>
              <Counter>
                {totalMinted}/{TOTAL_MINT_LIMIT}
              </Counter>
              <BaseText>Number of minted NFTs </BaseText>
            </NftCount>
          </BottomText>
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
  padding: 100px;
  display: grid;
  grid-template-rows: auto 1fr;
  justify-content: flex-start;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LeftContent = styled.div`
  justify-self: center;
  align-self: center;
  display: grid;
`;

const Title = styled.h2`
  font-weight: 700;
  font-size: 48px;
  line-height: 56px;
  max-width: 380px;
  margin: 16px 0 24px 0;
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

const NftLink = styled.a`
  ${baseBtn};
  background-color: #e92f9e;
  color: #fff;
  text-decoration: none;

  &:hover {
    background-color: #bc247f;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
const RightSide = styled.div`
  padding: 32px;
  display: grid;
  grid-template-rows: 1fr auto;
  background: linear-gradient(
      342.2deg,
      rgba(40, 168, 91, 0.4) 11.76%,
      rgba(0, 255, 255, 0.152) 41.29%
    ),
    radial-gradient(60.76% 54.36% at 13.8% 8.5%, #e92f9e 0%, #577bba 100%);
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
