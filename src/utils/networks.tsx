import { Chain } from "wagmi";

export const ganache = {
  id: 222,
  name: "Ganache",
  network: "Ganache",
  iconUrl: "/images/ganache.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Ganache",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["http://127.0.0.1:8545"] },
    default: { http: ["http://127.0.0.1:8545"] },
  },
  blockExplorers: {
    etherscan: { name: "Ganache", url: "http://127.0.0.1:8545" },
    default: { name: "Ganache", url: "http://127.0.0.1:8545" },
  }
} as Chain;

export const latestnet = {
  id: 418,
  name: "LaTestnet",
  network: "LaTestnet",
  iconUrl: "/images/lachain.svg",
  nativeCurrency: {
    decimals: 18,
    name: "LaTestnet",
    symbol: "TLA",
  },
  rpcUrls: {
    public: { http: ["https://rpc.testnet.lachain.network"] },
    default: { http: ["https://rpc.testnet.lachain.network"] },
  },
  blockExplorers: {
    etherscan: {
      name: "LaTestnet",
      url: "https://testexplorer.lachain.network",
    },
    default: { name: "LaTestnet", url: "https://testexplorer.lachain.network" },
  },
  contracts: {
    multicall3: {
      address: "0xA856b0e0daDA6c7a32584c9d308fE1046f7A7d1D",
      blockCreated: 2038385,
    },
  },
} as Chain;

export const _goerli = {
  id: 5,
  name: "Goerli",
  network: "Goerli",
  iconUrl: "/images/goerli.svg",
  nativeCurrency: {
    decimals: 18,
    name: "Goerli",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://light-patient-arm.ethereum-goerli.quiknode.pro/29bc0cd457096a5952d824bcb9186a59c3b07e98/"] },
    default: { http: ["https://light-patient-arm.ethereum-goerli.quiknode.pro/29bc0cd457096a5952d824bcb9186a59c3b07e98/"] },
  },
  blockExplorers: {
    etherscan: {
      name: "LaTestnet",
      url: "https://goerli.etherscan.io",
    },
    default: { name: "Goerli", url: "https://goerli.etherscan.io" },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
    },
  },
} as Chain;

