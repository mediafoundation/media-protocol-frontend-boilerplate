import { Sdk, MarketplaceViewer, Marketplace, MarketplaceStorage, Resources, MarketplaceHelper, validChains, ERC20, Quoter } from 'media-sdk';
import { useEffect, useState } from "react"
import { createWalletClient, custom } from "viem"
import { sepolia } from 'wagmi/chains';

export function useMediaSDK({
  address,
  isConnected,
  chain,
}: {
  address: any
  isConnected: boolean
  chain: any
}) {
  const [data, setData] = useState(null as any)

  useEffect(() => {
    let sdkInstance;

    let output = {
      walletClient: null as any,
      publicClient: null as any,
      marketplace: null as any,
      marketplaceStorage: null as any,
      marketplaceViewer: null as any,
      marketplaceHelper: null as any,
      resourcesContract: null as any,
      provider: null as any,
      quoter: null as any,
      erc20: null as any,
    }
    let currentChain
    if (chain && validChains.hasOwnProperty(chain.id)) {
      currentChain = chain
    } else {
      currentChain = sepolia
    }
    if (isConnected) {
      output.provider = window.ethereum as any

      const walletClient = createWalletClient({
        account: address,
        chain: currentChain,
        transport: custom(output.provider),
      })

      output.walletClient = walletClient

      sdkInstance = new Sdk({
        walletClient: walletClient as any,
      })
    } else {
      sdkInstance = new Sdk({chain: currentChain})
    }

    output.publicClient = sdkInstance.config.publicClient
    output.marketplace = new Marketplace(sdkInstance)
    output.marketplaceStorage = new MarketplaceStorage(sdkInstance)
    output.marketplaceViewer = new MarketplaceViewer(sdkInstance)
    output.marketplaceHelper = new MarketplaceHelper(sdkInstance)
    output.resourcesContract = new Resources(sdkInstance)
    output.quoter = new Quoter(sdkInstance)
    output.erc20 = new ERC20(sdkInstance)

    setData(output)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain, address])

  return data
}
