const main = async () => {
    const nftContractFactory = await hre.ethers.getContractFactory('SSGNFT');
    const nftContract = await nftContractFactory.deploy(169);
    await nftContract.deployed();
    console.log("Contract deployed to:", nftContract.address);
  
    // // Call the function.
    // let txn = await nftContract.mintNFT()
    // // Wait for it to be mined.
    // await txn.wait()
    // console.log("Minted NFT")
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();