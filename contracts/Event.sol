// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Event is ERC721, Ownable {
    string public metadataCID;
    uint256 public immutable ticketPrice;
    uint256 public immutable maxTickets;
    
    uint256 private _nextTokenId;
    mapping(uint256 => bool) public hasAttended;
    string public attendanceCID;

    event TicketCheckedIn(uint256 indexed tokenId, address indexed owner);

    constructor(
        address initialOwner,
        string memory _metadataCID,
        uint256 _ticketPrice,
        uint256 _maxTickets
    ) ERC721("SomPass Event Ticket", "SPET") Ownable(initialOwner) {
        metadataCID = _metadataCID;
        ticketPrice = _ticketPrice;
        maxTickets = _maxTickets;
    }

    function buyTicket() public payable {
        require(msg.value >= ticketPrice, "Incorrect payment amount");
        require(_nextTokenId < maxTickets, "All tickets have been sold");

        uint256 tokenId = _nextTokenId;
        _nextTokenId++;
        _safeMint(msg.sender, tokenId);

        // Refund any overpayment
        if (msg.value > ticketPrice) {
            payable(msg.sender).transfer(msg.value - ticketPrice);
        }
    }

    function checkIn(uint256 tokenId) public onlyOwner {
        address owner = ownerOf(tokenId);
        require(!hasAttended[tokenId], "Ticket has already been used");
        
        hasAttended[tokenId] = true;
        emit TicketCheckedIn(tokenId, owner);
    }

    function updateAttendanceCID(string memory _newCID) public onlyOwner {
        attendanceCID = _newCID;
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    function totalTicketsSold() public view returns (uint256) {
        return _nextTokenId;
    }
}