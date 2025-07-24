// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
// Removed Counters import - replaced with simple uint256 counters
import "./TicketNFT.sol";
import "./SponsorshipNFT.sol";

/**
 * @title Event
 * @dev Main event contract managing tickets, sponsorships, and interactions
 */
contract Event is Ownable, ReentrancyGuard {
    // Replaced Counters with simple uint256 counters
    
    TicketNFT public ticketNFT;
    SponsorshipNFT public sponsorshipNFT;
    
    uint256 private _ticketTierIds;
    uint256 private _sponsorshipTierIds;
    uint256 private _pollIds;
    
    struct TicketTier {
        string name;
        uint256 price;
        uint256 supply;
        uint256 sold;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
    }
    
    struct SponsorshipTier {
        string level;
        uint256 price;
        string metadataURI;
        uint256 supply;
        uint256 sold;
        bool isActive;
    }
    
    struct Poll {
        string questionHash;
        string[] options;
        uint256[] votes;
        uint256 totalVotes;
        uint256 endTime;
        bool isActive;
    }
    
    // Event details
    string public name;
    string public symbol;
    address public organizer;
    uint256 public startTime;
    uint256 public endTime;
    uint256 public maxAttendees;
    address public factory;
    
    // Mappings
    mapping(uint256 => TicketTier) public ticketTiers;
    mapping(uint256 => SponsorshipTier) public sponsorshipTiers;
    mapping(uint256 => Poll) public polls;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => bool) public attendanceRecorded;
    
    // Events
    event TicketTierCreated(uint256 indexed tierId, string name, uint256 price, uint256 supply);
    event TicketMinted(uint256 indexed tierId, address indexed to, uint256 tokenId);
    event SponsorshipTierCreated(uint256 indexed levelId, string level, uint256 price);
    event SponsorshipMinted(uint256 indexed levelId, address indexed sponsor, uint256 amount);
    event PollCreated(uint256 indexed pollId, string questionHash, string[] options);
    event VoteCast(uint256 indexed pollId, address indexed voter, uint256 optionId);
    event AttendanceRecorded(uint256 indexed ticketId, address indexed attendee);
    event PostEventDataAnchored(bytes32 indexed dataHash);
    
    modifier onlyOrganizer() {
        require(msg.sender == organizer, "Only organizer can call this function");
        _;
    }
    
    modifier onlyDuringEvent() {
        require(block.timestamp >= startTime && block.timestamp <= endTime, "Function only available during event");
        _;
    }
    
    constructor(
        string memory _name,
        string memory _symbol,
        address _organizer,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _maxAttendees,
        address _factory
    ) Ownable(_organizer) {  // Updated constructor for v5.x
        name = _name;
        symbol = _symbol;
        organizer = _organizer;
        startTime = _startTime;
        endTime = _endTime;
        maxAttendees = _maxAttendees;
        factory = _factory;
        
        // Deploy NFT contracts
        ticketNFT = new TicketNFT(_name, _symbol, address(this));
        sponsorshipNFT = new SponsorshipNFT(address(this));
        
        // No need to call _transferOwnership - handled by Ownable constructor
    }
    
    /**
     * @dev Creates a new ticket tier
     */
    function createTicketTier(
        string memory _name,
        uint256 _price,
        uint256 _supply,
        uint256 _startTime,
        uint256 _endTime
    ) external onlyOrganizer {
        require(_supply > 0, "Supply must be greater than 0");
        require(_startTime < _endTime, "Start time must be before end time");
        
        _ticketTierIds++;  // Replaced increment() with ++
        uint256 tierId = _ticketTierIds;  // Replaced current() with direct access
        
        ticketTiers[tierId] = TicketTier({
            name: _name,
            price: _price,
            supply: _supply,
            sold: 0,
            startTime: _startTime,
            endTime: _endTime,
            isActive: true
        });
        
        emit TicketTierCreated(tierId, _name, _price, _supply);
    }
    
    /**
     * @dev Mints a ticket to specified address
     */
    function mintTicket(uint256 tierId, address to) external payable nonReentrant {
        TicketTier storage tier = ticketTiers[tierId];
        require(tier.isActive, "Ticket tier is not active");
        require(tier.sold < tier.supply, "Tier sold out");
        require(block.timestamp >= tier.startTime && block.timestamp <= tier.endTime, "Tier not available");
        require(msg.value >= tier.price, "Insufficient payment");
        
        tier.sold++;
        uint256 tokenId = ticketNFT.mint(to, tierId);
        
        // Refund excess payment
        if (msg.value > tier.price) {
            payable(msg.sender).transfer(msg.value - tier.price);
        }
        
        emit TicketMinted(tierId, to, tokenId);
    }
    
    /**
     * @dev Creates a sponsorship tier
     */
    function createSponsorshipTier(
        string memory level,
        uint256 price,
        string memory metadataURI,
        uint256 supply
    ) external onlyOrganizer {
        require(supply > 0, "Supply must be greater than 0");
        
        _sponsorshipTierIds++;  // Replaced increment() with ++
        uint256 levelId = _sponsorshipTierIds;  // Replaced current() with direct access
        
        sponsorshipTiers[levelId] = SponsorshipTier({
            level: level,
            price: price,
            metadataURI: metadataURI,
            supply: supply,
            sold: 0,
            isActive: true
        });
        
        emit SponsorshipTierCreated(levelId, level, price);
    }
    
    /**
     * @dev Mints sponsorship NFT
     */
    function mintSponsorship(uint256 levelId, address sponsorAddress, uint256 amount) 
        external 
        payable 
        nonReentrant 
    {
        SponsorshipTier storage tier = sponsorshipTiers[levelId];
        require(tier.isActive, "Sponsorship tier is not active");
        require(tier.sold + amount <= tier.supply, "Not enough sponsorship slots available");
        require(msg.value >= tier.price * amount, "Insufficient payment");
        
        tier.sold += amount;
        sponsorshipNFT.mint(sponsorAddress, levelId, amount, "");
        
        emit SponsorshipMinted(levelId, sponsorAddress, amount);
    }
    
    /**
     * @dev Creates a poll
     */
    function submitPoll(string memory questionHash, string[] memory options) 
        external 
        onlyOrganizer 
        onlyDuringEvent 
    {
        require(options.length >= 2, "Poll must have at least 2 options");
        
        _pollIds++;  // Replaced increment() with ++
        uint256 pollId = _pollIds;  // Replaced current() with direct access
        
        polls[pollId] = Poll({
            questionHash: questionHash,
            options: options,
            votes: new uint256[](options.length),
            totalVotes: 0,
            endTime: block.timestamp + 1 hours, // Poll active for 1 hour
            isActive: true
        });
        
        emit PollCreated(pollId, questionHash, options);
    }
    
    /**
     * @dev Cast vote on a poll
     */
    function vote(uint256 pollId, uint256 optionId) external onlyDuringEvent {
        Poll storage poll = polls[pollId];
        require(poll.isActive, "Poll is not active");
        require(block.timestamp <= poll.endTime, "Poll has ended");
        require(optionId < poll.options.length, "Invalid option");
        require(!hasVoted[pollId][msg.sender], "Already voted");
        require(ticketNFT.balanceOf(msg.sender) > 0, "Must own a ticket to vote");
        
        hasVoted[pollId][msg.sender] = true;
        poll.votes[optionId]++;
        poll.totalVotes++;
        
        emit VoteCast(pollId, msg.sender, optionId);
    }
    
    /**
     * @dev Records attendance for a ticket
     */
    function recordAttendance(uint256 ticketId) external onlyOrganizer onlyDuringEvent {
        require(ticketNFT.exists(ticketId), "Ticket does not exist");
        require(!attendanceRecorded[ticketId], "Attendance already recorded");
        
        attendanceRecorded[ticketId] = true;
        address attendee = ticketNFT.ownerOf(ticketId);
        
        emit AttendanceRecorded(ticketId, attendee);
    }
    
    /**
     * @dev Anchors post-event data hash
     */
    function anchorPostEventData(bytes32 dataHash) external onlyOrganizer {
        require(block.timestamp > endTime, "Event must be finished");
        emit PostEventDataAnchored(dataHash);
    }
    
    /**
     * @dev Withdraws contract balance to organizer
     */
    function withdraw() external onlyOrganizer {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        payable(organizer).transfer(balance);
    }
    
    /**
     * @dev Gets poll results
     */
    function getPollResults(uint256 pollId) 
        external 
        view 
        returns (string[] memory options, uint256[] memory votes, uint256 totalVotes) 
    {
        Poll storage poll = polls[pollId];
        return (poll.options, poll.votes, poll.totalVotes);
    }
    
    /**
     * @dev Gets ticket tier count
     */
    function getTicketTierCount() external view returns (uint256) {
        return _ticketTierIds;  // Replaced current() with direct access
    }
    
    /**
     * @dev Gets sponsorship tier count
     */
    function getSponsorshipTierCount() external view returns (uint256) {
        return _sponsorshipTierIds;  // Replaced current() with direct access
    }
    
    /**
     * @dev Gets poll count
     */
    function getPollCount() external view returns (uint256) {
        return _pollIds;  // Replaced current() with direct access
    }
}