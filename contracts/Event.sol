// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Event is ERC721, Ownable {
    string public metadataCID;
    uint256 public ticketPrice;
    uint256 public maxTickets;
    uint256 public totalTicketsSold;

    mapping(uint256 => bool) private _hasAttended;

    event TicketCheckedIn(uint256 indexed tokenId, address indexed attendee);

    constructor(
        address initialOwner,
        string memory _metadataCID,
        uint256 _ticketPrice,
        uint256 _maxTickets
    ) ERC721("SomPass Ticket", "SPT") Ownable(initialOwner) {
        metadataCID = _metadataCID;
        ticketPrice = _ticketPrice;
        maxTickets = _maxTickets;
    }

    function buyTicket() public payable {
        require(totalTicketsSold < maxTickets, "All tickets have been sold");
        require(msg.value >= ticketPrice, "Insufficient funds to buy ticket");

        uint256 tokenId = totalTicketsSold;
        totalTicketsSold++;
        _safeMint(msg.sender, tokenId);
    }

    function checkIn(uint256 tokenId) public onlyOwner {
        require(_exists(tokenId), "Ticket does not exist");
        require(!_hasAttended[tokenId], "Ticket has already been used");
        _hasAttended[tokenId] = true;
        emit TicketCheckedIn(tokenId, ownerOf(tokenId));
    }

    function hasAttended(uint256 tokenId) public view returns (bool) {
        return _hasAttended[tokenId];
    }

    function withdraw() public onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
}