// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./Event.sol";

/**
 * @title EventFactory
 * @dev Factory contract for deploying new Event instances
 */
contract EventFactory is Ownable, ReentrancyGuard {
    
    uint256 private _eventIds;
    
    struct EventMetadata {
        address organizer;
        address eventContract;
        string category;
        string ipfsMetadataURI;
        uint256 timestamp;
        bool isActive;
    }
    
    mapping(uint256 => EventMetadata) public events;
    mapping(address => uint256[]) public organizerEvents;
    mapping(string => uint256[]) public categoryEvents;
    
    event EventCreated(
        uint256 indexed eventId,
        address indexed organizer,
        address indexed eventContract,
        string category,
        string ipfsMetadataURI
    );
    
    event EventStatusChanged(uint256 indexed eventId, bool isActive);
    
    /**
     * @dev Constructor - OpenZeppelin v5 requires initial owner
     */
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Creates a new event instance
     * @param name Event name
     * @param symbol Event symbol for tickets
     * @param category Event category
     * @param ipfsMetadataURI IPFS URI for event metadata
     * @param startTime Event start time
     * @param endTime Event end time
     * @param maxAttendees Maximum number of attendees
     */
    function createEvent(
        string memory name,
        string memory symbol,
        string memory category,
        string memory ipfsMetadataURI,
        uint256 startTime,
        uint256 endTime,
        uint256 maxAttendees
    ) external nonReentrant returns (uint256 eventId, address eventContract) {
        require(startTime > block.timestamp, "Start time must be in the future");
        require(endTime > startTime, "End time must be after start time");
        require(maxAttendees > 0, "Max attendees must be greater than 0");
        
        _eventIds++;
        eventId = _eventIds;
        
        // Deploy new Event contract
        Event newEvent = new Event(
            name,
            symbol,
            msg.sender,
            startTime,
            endTime,
            maxAttendees,
            address(this)
        );
        
        eventContract = address(newEvent);
        
        // Store event metadata
        events[eventId] = EventMetadata({
            organizer: msg.sender,
            eventContract: eventContract,
            category: category,
            ipfsMetadataURI: ipfsMetadataURI,
            timestamp: block.timestamp,
            isActive: true
        });
        
        // Update mappings
        organizerEvents[msg.sender].push(eventId);
        categoryEvents[category].push(eventId);
        
        emit EventCreated(eventId, msg.sender, eventContract, category, ipfsMetadataURI);
    }
    
    /**
     * @dev Toggles event active status (admin only)
     */
    function toggleEventStatus(uint256 eventId) external onlyOwner {
        require(eventId <= _eventIds, "Event does not exist");
        
        events[eventId].isActive = !events[eventId].isActive;
        emit EventStatusChanged(eventId, events[eventId].isActive);
    }
    
    /**
     * @dev Gets events by organizer
     */
    function getEventsByOrganizer(address organizer) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return organizerEvents[organizer];
    }
    
    /**
     * @dev Gets events by category
     */
    function getEventsByCategory(string memory category) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return categoryEvents[category];
    }
    
    /**
     * @dev Gets total number of events
     */
    function getTotalEvents() external view returns (uint256) {
        return _eventIds;
    }
    
    /**
     * @dev Gets event metadata
     */
    function getEventMetadata(uint256 eventId) 
        external 
        view 
        returns (EventMetadata memory) 
    {
        require(eventId <= _eventIds, "Event does not exist");
        return events[eventId];
    }
}