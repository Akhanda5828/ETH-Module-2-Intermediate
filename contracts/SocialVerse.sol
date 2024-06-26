// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SocialVerse is Ownable, ReentrancyGuard {

    uint256 public balance;
    bool public paused;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event Paused();
    event Unpaused();
    event PostCreated(address indexed user, string content, uint256 timestamp);
    event PostLiked(address indexed user, uint256 postId, uint256 timestamp);

    struct Post {
        address user;
        string content;
        uint256 timestamp;
        uint256 likes;
    }

    Post[] public posts;

    constructor() Ownable(msg.sender) {
        balance = 0;
        paused = false;
    }

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable onlyOwner whenNotPaused {
        uint256 _previousBalance = balance;
        balance += _amount; // Direct addition is safe in newer Solidity versions
        assert(balance == _previousBalance + _amount);
        emit Deposit(_amount);
    }

    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public onlyOwner nonReentrant whenNotPaused {
        uint256 _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({ balance: balance, withdrawAmount: _withdrawAmount });
        }
        balance -= _withdrawAmount; // Direct subtraction is safe in newer Solidity versions
        assert(balance == _previousBalance - _withdrawAmount);
        emit Withdraw(_withdrawAmount);
        payable(owner()).transfer(_withdrawAmount);
    }

    function pause() public onlyOwner {
        paused = true;
        emit Paused();
    }

    function unpause() public onlyOwner {
        paused = false;
        emit Unpaused();
    }

    function changeOwner(address newOwner) public onlyOwner {
        transferOwnership(newOwner);
    }

    function createPost(string memory content) public whenNotPaused {
        posts.push(Post({ user: msg.sender, content: content, timestamp: block.timestamp, likes: 0 }));
        emit PostCreated(msg.sender, content, block.timestamp);
    }

    function likePost(uint256 postId) public whenNotPaused {
        require(postId < posts.length, "Post does not exist");
        posts[postId].likes += 1; // Direct addition is safe in newer Solidity versions
        emit PostLiked(msg.sender, postId, block.timestamp);
    }

    function getPosts() public view returns (Post[] memory) {
        return posts;
    }
}
