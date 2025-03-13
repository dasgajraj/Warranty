const hre = require("hardhat");

async function main() {
  const Storage = await hre.ethers.getContractFactory("WarrantyStorage");
  const storage = await Storage.deploy(); // Deploy contract

  await storage.waitForDeployment(); // Wait for deployment to complete

  console.log(`✅ Contract deployed at: ${await storage.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
