import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { GlobalStyles } from "./globalStyles";

import { Landing } from "./pages/Landing";
import { Success } from "./pages/Success";

import { NftProvider } from "./utils/nftContext";

import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyles />
    <NftProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </BrowserRouter>
    </NftProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
