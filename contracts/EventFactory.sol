// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Event.sol";

contract EventFactory {
    address[] public allEvents;

    event EventCreated(
        address indexed eventContract,
        address indexed organizer,
        string metadataCID,
        uint256 ticketPrice,
        uint256 ticketSupply
    );

    function createEvent(
        string memory _metadataCID,
        uint256 _ticketPrice,
        uint256 _maxTickets
    ) public {
        Event newEvent = new Event(
            msg.sender,
            _metadataCID,
            _ticketPrice,
            _maxTickets
        );
        allEvents.push(address(newEvent));
        emit EventCreated(
            address(newEvent),
            msg.sender,
            _metadataCID,
            _ticketPrice,
            _maxTickets
        );
    }

    function getAllEvents() public view returns (address[] memory) {
        return allEvents;
    }
}