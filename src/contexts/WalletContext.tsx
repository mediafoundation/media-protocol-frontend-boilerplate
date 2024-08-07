import { useContext, createContext, ReactNode, useEffect } from "react"
import { InitializeContext } from "@contexts/Contextor"
import { Address, useAccount, useNetwork } from "wagmi"
import { useMediaSDK } from "@hooks/useMediaSDK"

//@ts-ignore
import { Encryption } from "media-sdk"
/* import { Encryption } from '../../../media-sdk'; */
import { parseUnits } from "viem"

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
}

export const Context = createContext(null)

export const useWalletContext = () => useContext(Context) as any

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { state, dispatchers } = InitializeContext(initialState)

  const { address, isConnected } = useAccount()

  const { chain } = useNetwork()

  const sdk = useMediaSDK({ address, isConnected, chain })

  if (sdk && !state.sdkReady) {
    dispatchers.setSdkReady(true)
  }

  let functions = {
    fetchOffers: async () => {
      const result: any = await sdk.marketplaceViewer.getAllOffersPaginating({
        marketplaceId: state.marketplaceId,
      })
      dispatchers.setOffers(result)
    },
    initMarket: async () => {
      const hash = await sdk.marketplace.initializeMarketplace({
        requiredStake: 100,
        marketFeeTo: address,
        marketFeeRate: 500,
      })
      const transaction = await sdk.publicClient.waitForTransactionReceipt({
        hash: hash,
      })
      dispatchers.setMarketplaceId(BigInt(transaction.logs[0].topics[1]))
    },
    fetchResources: async () => {
      const result: any = await sdk.resourcesContract.getPaginatedResources({
        address: address,
      })
      dispatchers.setResources(result[0])
    },
    fetchProviderDeals: async () => {
      const result: any = await sdk.marketplaceViewer.getAllDealsPaginating({
        marketplaceId: state.marketplaceId,
        address: address,
        isProvider: true,
      })
      dispatchers.setProviderDeals(result)
    },
    fetchClientDeals: async () => {
      const result: any = await sdk.marketplaceViewer.getAllDealsPaginating({
        marketplaceId: state.marketplaceId,
        address: address,
        isProvider: false,
      })
      dispatchers.setClientDeals(result)
    },
    getMarketplaceData: async () => {
      //const result: any = await resources.view("getResources", [address]);
      const marketFeeTo: any = await sdk.marketplace.view("marketFeeTo", [
        state.marketplaceId,
      ])
      const marketFeeRate: any = await sdk.marketplace.view(
        "marketFeeRate",
        [state.marketplaceId]
      )
      const requiredStake: any = await sdk.marketplace.view(
        "REQUIRED_STAKE",
        [state.marketplaceId]
      )
      const dealCount: any = await sdk.marketplace.view("dealAutoIncrement", [
        state.marketplaceId,
      ])
      const offerCount: any = await sdk.marketplace.view("offerAutoIncrement", [
        state.marketplaceId,
      ])
      const owner: any = await sdk.marketplace.view("owners", [
        state.marketplaceId,
      ])
      const object = {
        marketFeeTo,
        marketFeeRate,
        requiredStake,
        dealCount,
        offerCount,
        owner,
      }
      dispatchers.setMarketplaceData(object)
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
        metadata,
      })
      const transaction = await sdk.publicClient.waitForTransactionReceipt({
        hash: hash,
      })
      console.log(transaction)
    },
    getRegistrationStatus: async (address: any) => {
      const result: any = await sdk.marketplace.view("isRegisteredProvider", [
        state.marketplaceId,
        address,
      ])
      dispatchers.setIsRegisteredProvider(result)
    },
    getEncryptionPublicKey: async () => {
      let _encryptionPublicKey = await sdk.provider.request({
        method: "eth_getEncryptionPublicKey",
        params: [address], // you must have access to the specified account
      })
      dispatchers.setEncryptionPublicKey(_encryptionPublicKey)
    },

    registerProvider: async ({ label, inputToken, inputAmount }: any) => {
      let hash
      if (inputToken.symbol == "ETH") {
        hash = await sdk.marketplaceHelper.addLiquidityAndRegisterWithETH({
          marketplaceId: state.marketplaceId,
          label,
          publicKey: state.encryptionPublicKey,
          minMediaAmountOut: 0,
          slippage: 5000,
          amount: parseUnits(inputAmount, inputToken.decimals),
        })
      } else {
        hash = await sdk.marketplaceHelper.addLiquidityAndRegister({
          marketplaceId: state.marketplaceId,
          inputToken: inputToken.address,
          inputAmount: parseUnits(inputAmount, inputToken.decimals),
          label,
          publicKey: state.encryptionPublicKey,
          slippage: 5000,
        })
      }
      const transaction = await sdk.publicClient.waitForTransactionReceipt({
        hash: hash,
      })
      console.log(transaction)
    },
    unregisterProvider: async () => {
      const hash = await sdk.marketplaceHelper.execute(
        "unregisterRemoveLiquidity",
        [state.marketplaceId, 0, 0]
      )
      const transaction = await sdk.publicClient.waitForTransactionReceipt({
        hash: hash,
      })
      console.log(transaction)
    },
    cancelDeal: async (id: bigint) => {
      const hash = await sdk.marketplace.cancelDeal({
        marketplaceId: state.marketplaceId,
        dealId: id,
      })
      const transaction = await sdk.publicClient.waitForTransactionReceipt({
        hash: hash,
      })
      console.log(transaction)
    },
    addResource: async (metadata: string) => {
      try {
        const { sharedKey, iv, tag, encryptedData } =
          Encryption.encrypt(metadata)
        let ownerSharedKeyCopy = Encryption.ethSigEncrypt(
          state.encryptionPublicKey,
          sharedKey
        )

        let resourceEncryptedData = JSON.stringify({
          encryptedData: encryptedData,
          iv: iv,
          tag: tag,
        })

        const hash = await sdk.resourcesContract.addResource({
          encryptedData: resourceEncryptedData,
          sharedKeyCopy: ownerSharedKeyCopy,
          ownerKeys: "",
        })
        const transaction = await sdk.publicClient.waitForTransactionReceipt({
          hash: hash,
        })
        console.log(transaction)
      } catch (e) {
        console.log(e)
        return false
      }
    },
    approveToken: async (
      tokenAddress: Address,
      spenderAddress: Address,
      amount: bigint
    ) => {},
    //     fetchTokenInfo: async (token: any, walletAddress: any) => {
    // /*       let provider: any = await detectEthereumProvider();
    //       provider = new providers.Web3Provider(provider); */
    //       let contract;
    //       let balance = BigInt(0);
    //       let allowance = BigInt(0);
    //       //if address is _ we assume is the native coin (ETH) and not an ERC20 Token
    //       if (token.address == "_") {
    //         balance = await sdk.publicClient.getBalance({
    //           address: walletAddress || sdk.publicClient.address,
    //         });
    //         allowance = BigInt(MAX_INT);
    //       } else {
    //         contract = new ethers.Contract(
    //           token.address,
    //           MediaERC20.abi,
    //           provider.getSigner()
    //         );
    //         try {
    //           balance = await contract.balanceOf(walletAddress);
    //           console.log("balance", balance.toString());
    //           allowance = await contract.allowance(
    //             walletAddress,
    //             ProviderHelper.networks[provider.network.chainId].address
    //           );
    //           console.log("allowance", allowance);
    //         } catch (error) {
    //           console.error("Error fetching token data:", error);
    //         }
    //       }
    //       return {
    //         balance: balance,
    //         allowance: allowance,
    //         contract: contract,
    //       };
    //     }
  }

  useEffect(() => {
    if (chain && state.currentChain !== chain.id) {
      dispatchers.resetInitialState()
      dispatchers.setCurrentChain(chain.id)
    }
  }, [chain])

  useEffect(() => {
    if (address && state.marketplaceId) {
      dispatchers.resetClientDeals()
      dispatchers.resetProviderDeals()
      dispatchers.resetResources()
      dispatchers.resetDecryptedResources()
      dispatchers.resetEncryptionPublicKey()
      dispatchers.resetIsRegisteredProvider()
      if (address) {
        functions.getRegistrationStatus(address)
      }
    }
  }, [address])

  useEffect(() => {
    dispatchers.resetMarketplaceData()
    dispatchers.resetOffers()
    dispatchers.resetProviderDeals()
    dispatchers.resetClientDeals()
    if (state.marketplaceId) {
      functions.getMarketplaceData()
      if (address) {
        functions.getRegistrationStatus(address)
      }
    }
  }, [state.marketplaceId])

  return (
    <Context.Provider
      value={{ ...state, ...dispatchers, ...functions, ...sdk }}
    >
      {children}
    </Context.Provider>
  )
}
