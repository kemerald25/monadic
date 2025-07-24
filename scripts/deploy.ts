import { ethers, upgrades } from "hardhat";
import * as fs from "fs";
import * as path from "path";

// Helper function to format MON balance
function formatMON(balance: bigint): string {
  return ethers.formatEther(balance);
}

async function main() {
  console.log("Starting deployment to Monad...");

  // Get the deployer account
  const signers = await ethers.getSigners();

  if (signers.length === 0) {
    throw new Error(
      "No signers available. Please check your network configuration and private key."
    );
  }

  const [deployer] = signers;
  console.log("Deploying contracts with account:", deployer.address);

  // Check if account has balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", formatMON(balance), "MON");

  if (balance === 0n) {
    throw new Error(
      "Deployer account has no MON balance. Please fund the account with Monad testnet tokens."
    );
  }

  // Deploy EventFactory
  console.log("\nDeploying EventFactory...");
  const EventFactory = await ethers.getContractFactory("EventFactory");
  const eventFactory = await EventFactory.deploy();
  await eventFactory.waitForDeployment();
  const eventFactoryAddress = await eventFactory.getAddress();
  console.log("EventFactory deployed to:", eventFactoryAddress);

  // Wait for a few block confirmations
  console.log("Waiting for block confirmations...");
  await eventFactory.deploymentTransaction()?.wait(2);

  // Optional: Create a test event to demonstrate the full flow
  console.log("\n🧪 Creating test event...");
  const currentTime = Math.floor(Date.now() / 1000);
  const startTime = currentTime + 86400; // 1 day from now
  const endTime = startTime + 86400; // 1 day after start

  const createEventTx = await eventFactory.createEvent(
    "Test Event",
    "TEST",
    "Conference",
    "QmTestIPFSHash123", // Mock IPFS hash
    startTime,
    endTime,
    1000
  );

  const receipt = await createEventTx.wait();
  console.log("Test event created! Transaction hash:", receipt?.hash);

  // Get the created event details
  const eventCount = await eventFactory.getTotalEvents();
  console.log("Total events created:", eventCount.toString());

  if (eventCount > 0n) {
    const eventMetadata = await eventFactory.getEventMetadata(1);
    console.log("Test event contract address:", eventMetadata.eventContract);

    // Get the Event contract instance to show NFT addresses
    const Event = await ethers.getContractFactory("Event");
    const eventContract = Event.attach(eventMetadata.eventContract);

    const ticketNFTAddress = await eventContract.ticketNFT();
    const sponsorshipNFTAddress = await eventContract.sponsorshipNFT();

    console.log("TicketNFT address:", ticketNFTAddress);
    console.log("SponsorshipNFT address:", sponsorshipNFTAddress);
  }

  // Save deployment addresses
  const deploymentInfo = {
    network: "monad-testnet",
    eventFactory: eventFactoryAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await deployer.provider.getBlockNumber(),
    totalEvents: eventCount.toString(),
  };

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  // Save deployment info
  const deploymentPath = path.join(deploymentsDir, "monad-testnet.json");
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));

  // Update frontend environment file
  const envPath = path.join(__dirname, "../.env.local");
  let envContent = "";

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf8");
  }

  // Update or add contract addresses
  const updateEnvVar = (
    content: string,
    key: string,
    value: string
  ): string => {
    const regex = new RegExp(`^${key}=.*$`, "m");
    const newLine = `${key}=${value}`;

    if (regex.test(content)) {
      return content.replace(regex, newLine);
    } else {
      return content + (content.endsWith("\n") ? "" : "\n") + newLine + "\n";
    }
  };

  envContent = updateEnvVar(
    envContent,
    "VITE_EVENT_FACTORY_ADDRESS",
    eventFactoryAddress
  );

  fs.writeFileSync(envPath, envContent);

  console.log("\n✅ Deployment completed successfully!");
  console.log("📄 Deployment info saved to:", deploymentPath);
  console.log("🔧 Environment variables updated in:", envPath);

  console.log("\n📋 Contract Addresses:");
  console.log("EventFactory:", eventFactoryAddress);

  console.log("\n🔗 Verify contracts with:");
  console.log(
    `npx hardhat verify --network monad-testnet ${eventFactoryAddress}`
  );

  // Final balance check
  const finalBalance = await deployer.provider.getBalance(deployer.address);
  console.log("\n💰 Final account balance:", formatMON(finalBalance), "MON");
  console.log("💸 Deployment cost:", formatMON(balance - finalBalance), "MON");

  console.log("\n📝 Next steps:");
  console.log(
    "1. Users can create events by calling createEvent() on the EventFactory"
  );
  console.log(
    "2. Each event will automatically deploy its own TicketNFT and SponsorshipNFT contracts"
  );
  console.log(
    "3. Event organizers can then create ticket tiers and sponsorship tiers"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
