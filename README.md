## SocialVerse Smart Contract
The SocialVerse smart contract facilitates the creation of a decentralized social media platform. It allows users to create posts, like posts, and manage associated funds securely. The contract provides functionalities for depositing and withdrawing funds, controlled by the contract owner, and includes features to pause and resume contract activities for enhanced security and management.

## Description
The SocialVerse smart contract is designed to create a decentralized social media platform where users can create posts, like posts, and manage funds. The contract includes functionalities for depositing and withdrawing funds, which are controlled by the contract owner. The platform can be paused and unpaused by the owner to manage contract activities securely.

## Getting Started
# Installing

1. Clone the project repository from GitHub.
2. Navigate to the project directory.
3. Run the following command to install necessary dependencies:
``
   npm i
``

## Sample Smart Contract Code

``` javascript
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


## Executing program

1. Open three terminals in your VS Code and navigate to the project directory in each terminal.
2. In the first terminal, start the local blockchain node:


   ``
    npx hardhat node
   ``
4. In the second terminal, deploy the contract to the local blockchain network:


   ``
    npx hardhat run --network localhost scripts/deploy.js
   ``
6. In the third terminal, launch the front-end of the project:


   ``
    npm run dev
   ``

   
The project should now be running on your localhost, typically at http://localhost:3000/.


## Working

We will document the deployed contract address and place it in the required places of our project files and subsequently develop the project’s frontend. This frontend will establish a connection with the MetaMask wallet, directing the user to the wallet page for transaction approvals. Users will be able to create and 'like' posts, which will redirect them to MetaMask to authorize transactions. However, the 'Deposit' and 'Withdraw' functions will be disabled due to security concerns, as this network is not secure for fund transfers. This is a custom condition implemented for this project.

## Help
If you encounter any issues or need further assistance, refer to the help command within the project.
``
    npx hardhat help
``
## Authors

Contributors names and contact info:

Akhanda Pal Biswas[https://www.linkedin.com/in/akhanda-pal-biswas/]

## License
This project is licensed under the MIT License - see the LICENSE.md file for details.
