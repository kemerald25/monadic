// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title TicketNFT
 * @dev ERC721 tokens representing event tickets
 */
contract TicketNFT is ERC721, ERC721URIStorage, Ownable {
    
    uint256 private _tokenIds;
    
    struct TicketData {
        uint256 tierId;
        uint256 seatNumber;
        string perks;
        string qrCodeURI;
        bool isUsed;
    }
    
    mapping(uint256 => TicketData) public ticketData;
    
    event TicketMinted(uint256 indexed tokenId, address indexed to, uint256 tierId);
    event TicketUsed(uint256 indexed tokenId);
    
    modifier onlyEventContract() {
        require(msg.sender == owner(), "Only event contract can call this function");
        _;
    }
    
    constructor(
        string memory name, 
        string memory symbol, 
        address eventContract
    ) ERC721(name, symbol) Ownable(eventContract) {
        // Owner is set to eventContract in the Ownable constructor
    }
    
    /**
     * @dev Mints a new ticket NFT
     */
    function mint(address to, uint256 tierId) external onlyEventContract returns (uint256) {
        _tokenIds++;
        uint256 tokenId = _tokenIds;
        
        _mint(to, tokenId);
        
        // Generate ticket data
        ticketData[tokenId] = TicketData({
            tierId: tierId,
            seatNumber: tokenId, // Simple seat numbering
            perks: "",
            qrCodeURI: _generateQRCodeURI(tokenId),
            isUsed: false
        });
        
        emit TicketMinted(tokenId, to, tierId);
        return tokenId;
    }
    
    /**
     * @dev Marks ticket as used
     */
    function useTicket(uint256 tokenId) external onlyEventContract {
        require(_ownerOf(tokenId) != address(0), "Ticket does not exist");
        require(!ticketData[tokenId].isUsed, "Ticket already used");
        
        ticketData[tokenId].isUsed = true;
        emit TicketUsed(tokenId);
    }
    
    /**
     * @dev Updates ticket perks
     */
    function updatePerks(uint256 tokenId, string memory perks) external onlyEventContract {
        require(_ownerOf(tokenId) != address(0), "Ticket does not exist");
        ticketData[tokenId].perks = perks;
    }
    
    /**
     * @dev Generates QR code URI for ticket
     */
    function _generateQRCodeURI(uint256 tokenId) private view returns (string memory) {
        return string(abi.encodePacked(
            "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=",
            Strings.toString(tokenId),
            "-",
            Strings.toHexString(uint256(uint160(address(this))), 20)
        ));
    }
    
    /**
     * @dev Checks if token exists
     */
    function exists(uint256 tokenId) external view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
    
    /**
     * @dev Gets total supply
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIds;
    }
    
    // Override required functions
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}