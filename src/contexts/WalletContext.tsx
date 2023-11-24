import { useContext, createContext, ReactNode, useEffect } from "react";
import { InitializeContext } from "@contexts/Contextor";
import { useAccount, useNetwork } from 'wagmi';
import { useMediaSDK } from '@hooks/useMediaSDK';

const initialState = {
  offers: [],
  clientDeals: [],
  providerDeals: [],
  resources: [],
  decryptedResources: [],
  marketplaceData: null,
  marketplaceId: BigInt(0),
  isRegisteredProvider: false,
  encryptionPublicKey: null,
  sdkReady: false,
};

export const Context = createContext(null);

export const useWalletContext = () => useContext(Context) as any;

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { state, dispatchers } = InitializeContext(initialState);

  const { address, isConnected } = useAccount();
  
  const { chain } = useNetwork();

  const sdk = useMediaSDK({ address, isConnected, chain });

  if(sdk && !state.sdkReady){
    dispatchers.setSdkReady(true);
  }

  let functions = {
    fetchOffers: async () => {
      const result: any = await sdk.marketplaceViewer.getAllOffersPaginating(state.marketplaceId);
      dispatchers.setOffers(result);
    },
    initMarket: async () => {
      const hash = await sdk.marketplace.initializeMarketplace(100, address, 5);
      const transaction = await sdk.publicClient.waitForTransactionReceipt( 
        { hash: hash }
      )
      dispatchers.setMarketplaceId(BigInt(transaction.logs[0].topics[1]));
    },
    fetchResources: async () => {
      const result: any = await sdk.resourcesContract.getPaginatedResources(address);
      dispatchers.setResources(result[0]);
    },
    fetchProviderDeals: async () => {
      const result: any = await sdk.marketplaceViewer.getAllDealsPaginating(state.marketplaceId, address, true);
      dispatchers.setProviderDeals(result);
    },
    fetchClientDeals: async () => {
      const result: any = await sdk.marketplaceViewer.getAllDealsPaginating(state.marketplaceId, address, false);
      dispatchers.setClientDeals(result);
    },
    getMarketplaceData: async () => {
      //const result: any = await resources.view("getResources", [address]);
      const marketFeeTo: any = await sdk.marketplace.view("getMarketFeeTo", [state.marketplaceId])
      const marketFeeRate: any = await sdk.marketplace.view("getMarketFeeRate", [state.marketplaceId])
      const requiredStake: any = await sdk.marketplace.view("getRequiredStake", [state.marketplaceId])
      const dealCount: any = await sdk.marketplace.view("dealCounter", [state.marketplaceId])
      const object = {
        marketFeeTo,
        marketFeeRate,
        requiredStake,
        dealCount
      }
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
      const hash = await sdk.marketplace.createOffer(state.marketplaceId, maximumDeals, autoAccept, pricePerSecond, minDealDuration, billFullPeriods, singlePeriodOnly, metadata);
      const transaction = await sdk.publicClient.waitForTransactionReceipt( 
        { hash: hash }
      )
      console.log(transaction);
    },
    getRegistrationStatus: async (address: any) => {
      const result: any = await sdk.marketplace.view("isRegisteredProvider", [state.marketplaceId, address]);
      dispatchers.setIsRegisteredProvider(result);
    },
    getEncryptionPublicKey: async () => {
      let _encryptionPublicKey = await sdk.provider.request({
        method: "eth_getEncryptionPublicKey",
        params: [address], // you must have access to the specified account
      });
      dispatchers.setEncryptionPublicKey(_encryptionPublicKey);
    },
/*     
solidity function

function addLiquidityAndRegisterWithETH(
      uint256 marketplaceId,
      string memory label,
      string memory publicKey
    ) external payable nonReentrant returns (uint256 lpTokens){
      // Wrap raw ETH to WETH
      IWETH weth = IWETH(router.WETH());
      weth.deposit{value: msg.value}();
      IERC20 _weth = IERC20(router.WETH());

      (uint256 mediaAmount, uint256 wethAmount) = handleTokenSwap(_weth, msg.value);
      return handleRegister(marketplaceId, mediaAmount, wethAmount, label, publicKey);
  } */
    registerProvider: async (label: string) => {
      const hash = await sdk.helper.execute(
        "addLiquidityAndRegisterWithETH", 
        [state.marketplaceId, label, state.encryptionPublicKey], 
        100
      );
      const transaction = await sdk.publicClient.waitForTransactionReceipt( 
        { hash: hash }
      )
      console.log(transaction);
    }
  }

  useEffect(() => {
    dispatchers.resetInitialState()
  }, [chain]);

  useEffect(() => {
    dispatchers.resetMarketplaceData();
    dispatchers.resetOffers();
    dispatchers.resetProviderDeals();
    dispatchers.resetClientDeals();
    if(state.marketplaceId){
      functions.getRegistrationStatus(address);
      functions.getMarketplaceData()
    }
  }, [state.marketplaceId]);

  return (
    <Context.Provider value={{ ...state, ...dispatchers, ...functions, ...sdk  }}>
      {children}
    </Context.Provider>
  );
};

