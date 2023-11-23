//@ts-ignore
import { initSdk, MarketplaceViewer, Marketplace, Resources, Helper } from 'media-sdk';
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { latestnet } from '@utils/networks';
import { useEffect, useState } from 'react'

export function useMediaSDK(
  { 
    address, 
    isConnected, 
    chain 
  }: { address: any, isConnected: boolean, chain: any }) {
    
  const [data, setData] = useState(null as any)

  useEffect(() => {
    let output = {
      walletClient: null as any,
      publicClient: null as any,
      marketplace: null as any,
      marketplaceViewer: null as any,
      resourcesContract: null as any,
      helper: null as any,
      provider: null as any
    };

    let currentChain = chain || latestnet as any;

    if(isConnected) {
      output.provider = window.ethereum as any;
      const walletClient = createWalletClient({
        account: address,
        chain: currentChain,
        transport: custom(output.provider)
      })
      output.walletClient = walletClient;

      initSdk({
        chain: chain as any,
        walletClient: walletClient as any
      });

    } else {
      initSdk({
        chain: currentChain,
      });
    }

    const publicClient = createPublicClient({
      transport: http(currentChain.rpcUrls.default.http as any),
      chain: currentChain
    })
    output.publicClient = publicClient;
    output.marketplace = new Marketplace();
    output.marketplaceViewer = new MarketplaceViewer();
    output.resourcesContract = new Resources();
    output.helper = new Helper();

    setData(output);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain, address]);

  return data;
}