const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const SocialVerse = await hre.ethers.getContractFactory("SocialVerse");
  const socialVerse = await SocialVerse.deploy();

  await socialVerse.deployed();

  console.log("SocialVerse deployed to:", socialVerse.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
