import { useContext, createContext, ReactNode, useEffect } from "react";
import { InitializeContext } from "@contexts/Contextor";
import { useAccount, useNetwork } from "wagmi";
import { useMediaSDK } from "@hooks/useMediaSDK";

//@ts-ignore
/* import { Uniswap } from 'media-sdk'; */
import { Uniswap } from '../../../media-sdk';


const initialState = {
  offers: [],
  clientDeals: [],
  providerDeals: [],
  resources: [],
  decryptedResources: {},
  marketplaceData: null,
  marketplaceId: BigInt(0),
  isRegisteredProvider: false,
  encryptionPublicKey: null,
  sdkReady: false,
  currentChain: null,
};

export const Context = createContext(null);

export const useWalletContext = () => useContext(Context) as any;

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { state, dispatchers } = InitializeContext(initialState);

  const { address, isConnected } = useAccount();

  const { chain } = useNetwork();

  const sdk = useMediaSDK({ address, isConnected, chain });

  if (sdk && !state.sdkReady) {
    dispatchers.setSdkReady(true);
  }

  let functions = {
    fetchOffers: async () => {
      const result: any = await sdk.marketplaceViewer.getAllOffersPaginating({
        marketplaceId: state.marketplaceId,
      });
      dispatchers.setOffers(result);
    },
    initMarket: async () => {
      const hash = await sdk.marketplace.initializeMarketplace({
        requiredStake: 100,
        marketFeeTo: address,
        marketFeeRate: 500,
      });
      const transaction = await sdk.publicClient.waitForTransactionReceipt({
        hash: hash,
      });
      dispatchers.setMarketplaceId(BigInt(transaction.logs[0].topics[1]));
    },
    fetchResources: async () => {
      const result: any = await sdk.resourcesContract.getPaginatedResources({
        address: address,
      });
      dispatchers.setResources(result[0]);
    },
    fetchProviderDeals: async () => {
      const result: any = await sdk.marketplaceViewer.getAllDealsPaginating({
        marketplaceId: state.marketplaceId,
        address: address,
        isProvider: true,
      });
      dispatchers.setProviderDeals(result);
    },
    fetchClientDeals: async () => {
      const result: any = await sdk.marketplaceViewer.getAllDealsPaginating({
        marketplaceId: state.marketplaceId,
        address: address,
        isProvider: false,
      });
      dispatchers.setClientDeals(result);
    },
    getMarketplaceData: async () => {
      //const result: any = await resources.view("getResources", [address]);
      const marketFeeTo: any = await sdk.marketplace.view("getMarketFeeTo", [
        state.marketplaceId,
      ]);
      const marketFeeRate: any = await sdk.marketplace.view(
        "getMarketFeeRate",
        [state.marketplaceId]
      );
      const requiredStake: any = await sdk.marketplace.view(
        "getRequiredStake",
        [state.marketplaceId]
      );
      const dealCount: any = await sdk.marketplace.view("dealAutoIncrement", [
        state.marketplaceId,
      ]);
      const offerCount: any = await sdk.marketplace.view("offerAutoIncrement", [
        state.marketplaceId,
      ]);
      const object = {
        marketFeeTo,
        marketFeeRate,
        requiredStake,
        dealCount,
        offerCount
      };
      console.log(object);
      dispatchers.setMarketplaceData(object);
    },
    createOffer: async (
      maximumDeals: string,
      autoAccept: boolean,
      pricePerSecond: string,
      minDealDuration: string,
      billFullPeriods: boolean,
      singlePeriodOnly: boolean,
      metadata: string
    ) => {
      const hash = await sdk.marketplace.createOffer({
        marketplaceId: state.marketplaceId,
        maximumDeals,
        autoAccept,
        pricePerSecond,
        minDealDuration,
        billFullPeriods,
        singlePeriodOnly,
        metadata
      });
      const transaction = await sdk.publicClient.waitForTransactionReceipt({
        hash: hash,
      });
      console.log(transaction);
    },
    getRegistrationStatus: async (address: any) => {
      const result: any = await sdk.marketplace.view("isRegisteredProvider", [
        state.marketplaceId,
        address,
      ]);
      dispatchers.setIsRegisteredProvider(result);
    },
    getEncryptionPublicKey: async () => {
      let _encryptionPublicKey = await sdk.provider.request({
        method: "eth_getEncryptionPublicKey",
        params: [address], // you must have access to the specified account
      });
      dispatchers.setEncryptionPublicKey(_encryptionPublicKey);
    },
  
    registerProvider: async (label: string) => {
      const hash = await sdk.marketplaceHelper.addLiquidityAndRegisterWithETH({
        marketplaceId: state.marketplaceId,
        label,
        publicKey: state.encryptionPublicKey,
        minMediaAmountOut: 0,
        slippage: 5000,
        amount: 25e16.toString()
      });
    
      const transaction = await sdk.publicClient.waitForTransactionReceipt({
        hash: hash,
      });
      console.log(transaction);
    },
    unregisterProvider: async () => {
      const hash = await sdk.marketplaceHelper.execute(
        "unregisterRemoveLiquidityAndSwap",
        [state.marketplaceId, 0, 0]
      );
      const transaction = await sdk.publicClient.waitForTransactionReceipt({
        hash: hash,
      });
      console.log(transaction);
    },
    cancelDeal: async (id: bigint) => {
      const hash = await sdk.marketplace.cancelDeal({
        marketplaceId: state.marketplaceId,
        dealId: id,
      });
      const transaction = await sdk.publicClient.waitForTransactionReceipt({
        hash: hash,
      });
      console.log(transaction);
    },
  };

  useEffect(() => {
    if (chain && state.currentChain !== chain.id) {
      dispatchers.resetInitialState();
      dispatchers.setCurrentChain(chain.id);
    }
  }, [chain]);

  useEffect(() => {
    dispatchers.resetMarketplaceData();
    dispatchers.resetOffers();
    dispatchers.resetProviderDeals();
    dispatchers.resetClientDeals();
    if (state.marketplaceId) {
      functions.getMarketplaceData();
      if (address) {
        functions.getRegistrationStatus(address);
      }
    }
  }, [state.marketplaceId]);

  return (
    <Context.Provider
      value={{ ...state, ...dispatchers, ...functions, ...sdk }}
    >
      {children}
    </Context.Provider>
  );
};
