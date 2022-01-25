import React, { createContext, Dispatch, ReactElement, useState } from "react";

const NftContext = createContext<{
  nftLink: string;
  setNftLink: Dispatch<React.SetStateAction<string>>;
  totalMinted: number;
  setTotalMinted: Dispatch<React.SetStateAction<number>>;
}>({
  nftLink: "",
  setNftLink: () => {},
  totalMinted: 0,
  setTotalMinted: () => {},
});

// A "provider" is used to encapsulate only the
// components that needs the state in this context
function NftProvider({ children }: { children: ReactElement }) {
  const [nftLink, setNftLink] = useState<string>("");
  const [totalMinted, setTotalMinted] = useState<number>(0);

  const value = { nftLink, setNftLink, totalMinted, setTotalMinted };

  return <NftContext.Provider value={value}>{children}</NftContext.Provider>;
}

// Custom hook to interact with the context
function useNftContext() {
  const context = React.useContext(NftContext);
  if (context === undefined) {
    throw new Error("useNftContext must be used within a NftProvider");
  }
  return context;
}

export { NftProvider, useNftContext };
