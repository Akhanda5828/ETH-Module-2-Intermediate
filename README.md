# ETH-Module-2-Intermediate

We will create a HotelReservation smart contract which has several functions like withdraw, deposit, reserve room and cancel room.


Now we will first of all create a smart contract and then deploy in in VS Code using hardhat.


```js

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract HotelReservation {
    address payable public owner;
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event RoomReserved(uint256 roomId);
    event RoomCancelled(uint256 roomId);

    struct Room {
        bool isReserved;
        address reservedBy;
    }

    mapping(uint256 => Room) public rooms;

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns(uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;

        require(msg.sender == owner, "You are not the owner of this account");

        balance += _amount;
        assert(balance == _previousBalance + _amount);

        emit Deposit(_amount);
    }

    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");

        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        balance -= _withdrawAmount;
        assert(balance == (_previousBalance - _withdrawAmount));

        emit Withdraw(_withdrawAmount);
    }

    function reserveRoom(uint256 _roomId) public {
        require(!rooms[_roomId].isReserved, "Room already reserved");

        rooms[_roomId].isReserved = true;
        rooms[_roomId].reservedBy = msg.sender;

        emit RoomReserved(_roomId);
    }

    function cancelRoom(uint256 _roomId) public {
        require(rooms[_roomId].isReserved, "Room is not reserved");
        require(rooms[_roomId].reservedBy == msg.sender, "You are not the reserver of this room");

        rooms[_roomId].isReserved = false;
        rooms[_roomId].reservedBy = address(0);

        emit RoomCancelled(_roomId);
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


We will note down the deployed contract address and after that we will create a frontend for the project and then create a connection with the metamask wallet ans then direct the user to the wallet page whenever any transaction is to be made.
