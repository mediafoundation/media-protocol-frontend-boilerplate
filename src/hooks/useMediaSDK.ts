//@ts-ignore
/* import { initSdk, config, MarketplaceViewer, Marketplace, Resources, Helper } from 'media-sdk'; */
import { initSdk, config, MarketplaceViewer, Marketplace, Resources, MarketplaceHelper, Quoter, validChains, Pool } from '../../../media-sdk';
import { ganache } from '@utils/networks';
import { goerli } from "wagmi/chains";
import { useEffect, useState } from 'react'
import { createWalletClient, custom } from 'viem';

//import useRacedEffect from "@hooks/useRacedEffect";

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
      marketplaceHelper: null as any,
      resourcesContract: null as any,
      provider: null as any,
      quoter: null as any,
      pool: null as any
    };
    let currentChain;
    if(chain && validChains.hasOwnProperty(chain.id)) {
      currentChain = chain;
    } else {
      console.log('invalid chain');
    }

    if(isConnected) {
      output.provider = window.ethereum as any;
      
      const walletClient = createWalletClient({
        account: address,
        chain: currentChain,
        transport: custom(output.provider)
      })

      output.walletClient = walletClient;

      initSdk({
        walletClient: walletClient as any
      });

    } else {
      console.log('not connected', currentChain);
      initSdk();
    }

    output.publicClient = config().publicClient;
    output.marketplace = new Marketplace();
    output.marketplaceViewer = new MarketplaceViewer();
    output.marketplaceHelper = new MarketplaceHelper();
    output.resourcesContract = new Resources();
    output.quoter = new Quoter();
    output.pool = new Pool();

    setData(output);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain, address]);

  return data;
}