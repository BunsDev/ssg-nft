const main = async () => {
  // compile contract and generate files under /artifacts
  // HRE - Hardhat Runtime Environment
    const nftContractFactory = await hre.ethers.getContractFactory('SSGNFT');
  // create local Eth network for the contract
    const nftContract = await nftContractFactory.deploy(169);
  // wait until the contract is deployed
    await nftContract.deployed();
    console.log("Contract deployed to:", nftContract.address);

    // // Call the function & wait for mint
    // let txn = await nftContract.mintNFT()
    // await txn.wait();
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