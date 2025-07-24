// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title SponsorshipNFT
 * @dev ERC1155 tokens representing sponsorship tiers
 */
contract SponsorshipNFT is ERC1155, Ownable {
    using Strings for uint256;
    
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => uint256) public tokenTotalSupply; // Renamed to avoid conflict
    
    event SponsorshipMinted(address indexed to, uint256 indexed id, uint256 amount);
    event URIUpdated(uint256 indexed id, string uri);
    
    modifier onlyEventContract() {
        require(msg.sender == owner(), "Only event contract can call this function");
        _;
    }
    
    constructor(address eventContract) ERC1155("") Ownable(eventContract) {
        // Owner is set to eventContract in the Ownable constructor
    }
    
    /**
     * @dev Mints sponsorship NFTs
     */
    function mint(
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) external onlyEventContract {
        _mint(to, id, amount, data);
        tokenTotalSupply[id] += amount;
        
        emit SponsorshipMinted(to, id, amount);
    }
    
    /**
     * @dev Batch mints sponsorship NFTs
     */
    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) external onlyEventContract {
        _mintBatch(to, ids, amounts, data);
        
        for (uint256 i = 0; i < ids.length; i++) {
            tokenTotalSupply[ids[i]] += amounts[i];
        }
    }
    
    /**
     * @dev Sets URI for a token ID
     */
    function setURI(uint256 tokenId, string memory tokenURI) external onlyEventContract {
        _tokenURIs[tokenId] = tokenURI;
        emit URIUpdated(tokenId, tokenURI);
    }
    
    /**
     * @dev Returns URI for a token ID
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        string memory tokenURI = _tokenURIs[tokenId];
        
        // If token URI is set, return it
        if (bytes(tokenURI).length > 0) {
            return tokenURI;
        }
        
        // Otherwise return base URI with token ID
        return string(abi.encodePacked(super.uri(tokenId), tokenId.toString()));
    }
    
    /**
     * @dev Returns total supply of a token
     */
    function totalSupply(uint256 id) external view returns (uint256) {
        return tokenTotalSupply[id];
    }
    
    /**
     * @dev Checks if token exists
     */
    function exists(uint256 id) external view returns (bool) {
        return tokenTotalSupply[id] > 0;
    }
}