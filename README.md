# ETH-Module-2-Intermediate

We will create a SocialVerse smart contract which has several functions like withdraw, deposit, reserve room and cancel room.


Now we will first of all create a smart contract and then deploy in in VS Code using hardhat.


```js

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

```
After creating this file we will have to deploy it using hardhat so we follow the following instructions:

1. Inside the project directory, in the terminal type: npm i
2. Open two additional terminals in your VS code
3. In the second terminal type: npx hardhat node
4. In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js
5. Back in the first terminal, type npm run dev to launch the front-end.

After this, the project will be running on your localhost. 
Typically at http://localhost:3000/


We will note down the deployed contract address and after that we will create a frontend for the project and then create a connection with the metamask wallet ans then direct the user to the wallet page whenever any transaction is to be made. We can create a post,, like that particular post which will redirect to the metamask and ask for funds. Whereas the two functions Deposit and Withdraw won't run as this is not a secure network and therefore transfering anything is not secure (This is just a custom condition made by me).


## About

@Akhanda[https://www.linkedin.com/in/akhanda-pal-biswas-445a88230/]
