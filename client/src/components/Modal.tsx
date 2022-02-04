import styled, { css } from "styled-components";

import cautionIcon from "../assets/caution.svg";
import cross from "../assets/cross.svg";

type Props = {
  showModal: boolean;
  closeModal: () => void;
};

export const Modal = ({ showModal, closeModal }: Props) => {
  return (
    <Wrapper show={showModal}>
      <Backdrop />
      <Content>
        <CloseBtn onClick={closeModal}>
          <img alt="cross icon" src={cross} />
        </CloseBtn>
        <img alt="caution icon" src={cautionIcon} />
        <Header>Whoops!</Header>
        <Text>Please install metamask or use the mobile dApp browser!</Text>
      </Content>
    </Wrapper>
  );
};

interface IModalWrapper {
  show: boolean;
}

const Wrapper = styled.div<IModalWrapper>(
  ({ show }) => css`
    display: ${show ? "flex" : "none"};
    position: absolute;
    top: 0;
    left: 0;
    height: calc(100vh);
    width: 100%;
    justify-content: center;
    align-items: center;
  `
);

const Backdrop = styled.div`
  position: fixed;
  background: rgba(0, 0, 0, 0.8);
  opacity: 0.4;
  height: calc(100vh);
  width: 100%;
  top: 0;
  left: 0;
  z-index: 2;
`;

const Content = styled.div`
  position: relative;
  background-color: #f4f4f4;
  border-radius: 8px;
  padding: 16px;
  min-width: 343px;
  width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 3;
`;

const CloseBtn = styled.a`
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
`;

const Header = styled.h3`
  font-size: 24px;
  line-height: 28px;
  font-weight: 600;
  margin: 8px 0;
`;

const Text = styled.p`
  font-size: 16px;
  text-align: center;
  max-width: 216px;
`;
