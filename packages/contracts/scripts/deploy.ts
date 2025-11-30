import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
    const [deployer] = await ethers.getSigners();
    const network = await ethers.provider.getNetwork();
    
    console.log("Deploying PoSH contracts with account:", deployer.address);
    console.log("Network:", network.name, "ChainId:", network.chainId);
    console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)));

    // 1. Deploy HumanIdentity
    console.log("\n1. Deploying HumanIdentity...");
    const HumanIdentity = await ethers.getContractFactory("HumanIdentity");
    const humanIdentity = await HumanIdentity.deploy();
    await humanIdentity.waitForDeployment();
    const humanIdentityAddress = await humanIdentity.getAddress();
    console.log("   HumanIdentity deployed to:", humanIdentityAddress);

    // 2. Deploy ProofRegistry
    console.log("\n2. Deploying ProofRegistry...");
    const ProofRegistry = await ethers.getContractFactory("ProofRegistry");
    const proofRegistry = await ProofRegistry.deploy(humanIdentityAddress);
    await proofRegistry.waitForDeployment();
    const proofRegistryAddress = await proofRegistry.getAddress();
    console.log("   ProofRegistry deployed to:", proofRegistryAddress);

    // 3. Deploy PoSHNFT
    console.log("\n3. Deploying PoSHNFT...");
    const PoSHNFT = await ethers.getContractFactory("PoSHNFT");
    const poshNFT = await PoSHNFT.deploy(humanIdentityAddress, proofRegistryAddress);
    await poshNFT.waitForDeployment();
    const poshNFTAddress = await poshNFT.getAddress();
    console.log("   PoSHNFT deployed to:", poshNFTAddress);

    // 4. Deploy HumanScore
    console.log("\n4. Deploying HumanScore...");
    const HumanScore = await ethers.getContractFactory("HumanScore");
    const humanScore = await HumanScore.deploy(humanIdentityAddress, proofRegistryAddress);
    await humanScore.waitForDeployment();
    const humanScoreAddress = await humanScore.getAddress();
    console.log("   HumanScore deployed to:", humanScoreAddress);

    // Save deployment addresses
    const addresses = {
        chainId: Number(network.chainId),
        network: network.name,
        deployedAt: new Date().toISOString(),
        deployer: deployer.address,
        contracts: {
            HumanIdentity: humanIdentityAddress,
            ProofRegistry: proofRegistryAddress,
            PoSHNFT: poshNFTAddress,
            HumanScore: humanScoreAddress,
        },
    };

    const deploymentsDir = path.join(__dirname, "..", "deployments");
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    // Save to network-specific file
    const networkFileName = `${network.chainId}.json`;
    fs.writeFileSync(
        path.join(deploymentsDir, networkFileName),
        JSON.stringify(addresses, null, 2)
    );

    // Also save as addresses.json for easy import
    fs.writeFileSync(
        path.join(deploymentsDir, "addresses.json"),
        JSON.stringify(addresses, null, 2)
    );

    console.log("\n✅ Deployment complete!");
    console.log("Addresses saved to:", path.join(deploymentsDir, networkFileName));
    console.log("\nContract Addresses:");
    console.log("-------------------");
    console.log("HumanIdentity:", humanIdentityAddress);
    console.log("ProofRegistry:", proofRegistryAddress);
    console.log("PoSHNFT:      ", poshNFTAddress);
    console.log("HumanScore:   ", humanScoreAddress);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
