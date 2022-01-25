import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'Roboto';
    src: url('https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'Roboto';
    src: url('https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'Roboto';
    src: url('https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap');
    font-weight: 700;
    font-style: bold;
    font-display: swap;
  }

  * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  -webkit-tap-highlight-color: transparent;
  color: #112035;
  }

  &:focus {
    outline: none;
  }

  body {
    font-family: 'Roboto', sans-serif;
  }
`;
