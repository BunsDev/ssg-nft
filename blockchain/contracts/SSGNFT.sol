pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

import { Base64 } from "./libraries/Base64.sol";

contract SSGNFT is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  uint256 public totalSupply;

  event nftMinted(address sender, uint256 tokenId);

  string baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><defs><linearGradient id='a' x1='0%' y1='50%' x2='100%' y2='50%'><stop offset='0%' style='stop-color:";
  string firstChunk = ";stop-opacity:1'/><stop offset='100%' style='stop-color:";
  string secondChunk = ";stop-opacity:1'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#a)'/><text x='50%' y='50%' class='base' fill='#333' dominant-baseline='middle' text-anchor='middle'>";
  string finalChunk = "</text></svg>";

  string[] gradientStart = ["#8f00ff", "#ffafbd", "#2193b0", "#cc2b5e", "#de6262", "#dd5e89", "#614385", "#eecda3", "#eacda3", "#000428", "#ddd6f3", "#ba5370", "#4568dc"];
  string[] gradientEnd = ["#00d1ff", "#ffc3a0", "#6dd5ed", "#753a88", "#ffb88c", "#f7bb97", "#516395",  "#ef629f", "#d6ae7b", "#004e92", "#faaca8", "#f4e2d8", "#b06ab3"];

  constructor(uint256 _totalSupply) ERC721 ("SSG-NFT", "SSG") {
    totalSupply = _totalSupply;
  }

  function pickRandomGradientStart(uint256 tokenId) public view returns (string memory) {
    uint256 rand = random(string(abi.encodePacked("GRADIENT_START", Strings.toString(tokenId))));
    // Squash the # between 0 and the length of the array to avoid going out of bounds.
    rand = rand % gradientStart.length;
    return gradientStart[rand];
  }

  function pickRandomGradientEnd(uint256 tokenId) public view returns (string memory) {
    uint256 rand = random(string(abi.encodePacked("GRADIENT_END", Strings.toString(tokenId))));
    rand = rand % gradientEnd.length;
    return gradientEnd[rand];
  }

  function random(string memory input) internal pure returns (uint256) {
      return uint256(keccak256(abi.encodePacked(input)));
  }

  function getMintedNfts() public view returns (uint256) {
    return _tokenIds.current();
  }

  function mintNFT() public {
    require(totalSupply > _tokenIds.current(), "All NFTs have been minted");
    uint256 newItemId = _tokenIds.current();

    string memory gStart = pickRandomGradientStart(newItemId);
    string memory gEnd = pickRandomGradientEnd(newItemId);


    string memory title = string(abi.encodePacked(gStart, "-", gEnd));
    string memory finalGradient = string(abi.encodePacked(baseSvg, gStart, firstChunk, gEnd, secondChunk, gStart, "-", gEnd, finalChunk));

    // Get all the JSON metadata in place and base64 encode it.
    string memory json = Base64.encode(
        bytes(
            string(
                abi.encodePacked(
                    '{"name": "',
                    // We set the title of our NFT as the generated word.
                    title,
                    '", "description": "(S)mooth (S)quare (G)radient collection", "image": "data:image/svg+xml;base64,',
                    // We add data:image/svg+xml;base64 and then append our base64 encode our svg.
                    Base64.encode(bytes(finalGradient)),
                    '"}'
                )
            )
        )
    );

    string memory finalTokenUri = string(
        abi.encodePacked("data:application/json;base64,", json)
    );

    console.log("\n--------------------");
    console.log(finalTokenUri);
    console.log("--------------------\n");

     // Actually mint the NFT to the sender using msg.sender.
    _safeMint(msg.sender, newItemId);

    // Set the NFTs data.
    _setTokenURI(newItemId, finalTokenUri);

    // Increment the counter for when the next NFT is minted.
    _tokenIds.increment();
    console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);

    // Event
    emit nftMinted(msg.sender, newItemId);
  }

  
}