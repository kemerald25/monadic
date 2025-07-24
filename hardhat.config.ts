import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./src/contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    "monad-testnet": {
      url: process.env.MONAD_RPC_URL || "https://testnet-rpc.monad.xyz",
      accounts: process.env.PRIVATE_KEY
        ? [process.env.PRIVATE_KEY]
        : [
            "0x04537edf7ba665fbf495fab631702d7d88cec09732a9f28fefe5c07adf8e12cc",
          ],
      chainId: 0x279f,
    },
    "monad-mainnet": {
      url: process.env.MONAD_MAINNET_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 41455, // Assuming mainnet chain ID
    },
  },
  sourcify: {
    enabled: true,
  },
  etherscan: {
    apiKey: {
      "monad-testnet": process.env.MONAD_EXPLORER_API_KEY || "MQT1BEVCFCATQAA8B1MC66521Z2J1METHJ",
    },
    customChains: [
      {
        network: "monad-testnet",
        chainId: 0x279f,
        urls: {
          apiURL: "https://testnet-explorer.monad.xyz/api",
          browserURL: "https://testnet.monadexplorer.com/",
        },
      },
    ],
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  typechain: {
    outDir: "src/types/contracts",
    target: "ethers-v6",
  },
};

export default config;
