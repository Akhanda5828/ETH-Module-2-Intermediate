## SocialVerse Smart Contract
A simple overview of use/purpose.

## Description
The SocialVerse smart contract is designed to create a decentralized social media platform where users can create posts, like posts, and manage funds. The contract includes functionalities for depositing and withdrawing funds, which are controlled by the contract owner. The platform can be paused and unpaused by the owner to manage contract activities securely.

## Getting Started
# Installing

1. Clone the project repository from GitHub.
2. Navigate to the project directory.
3. Run the following command to install necessary dependencies:
   npm i

## Executing program

1. Open three terminals in your VS Code and navigate to the project directory in each terminal.
2. In the first terminal, start the local blockchain node:
    npx hardhat node
3. In the second terminal, deploy the contract to the local blockchain network:
    npx hardhat run --network localhost scripts/deploy.js
4. In the third terminal, launch the front-end of the project:
    npm run dev
   
The project should now be running on your localhost, typically at http://localhost:3000/.


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
