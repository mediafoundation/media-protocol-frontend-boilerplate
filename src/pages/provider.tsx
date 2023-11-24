
import type { NextPage } from 'next';
import { useAccount } from 'wagmi';
import { useWalletContext } from '@contexts/WalletContext';
import { useEffect } from 'react';

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function (): string {
  return this.toString();
};

const Home: NextPage = () => {

  const { address, isConnected } = useAccount();
  
  const wc = useWalletContext();

  useEffect(() => {
    if (
      wc.sdkReady && 
      wc.providerDeals.length == 0 && 
      wc.isRegisteredProvider && 
      wc.marketplaceId
    ) {
      wc.fetchProviderDeals()
    }
  }, [isConnected, wc.sdkReady, wc.marketplaceId])

  useEffect(() => {
    if (wc.sdkReady && wc.marketplaceId) {
      wc.fetchProviderDeals()
    }
  }, [address])
  
  return (
    <>
      <h1 className="text-3xl font-bold">
        Deals as Provider
      </h1>
      <p>
        Here you can view all the deals you have as a provider.
      </p>
      {wc.marketplaceId && ( 
        <>
          {isConnected && ( 
            <>
              <div>
                <button 
                  onClick={wc.fetchProviderDeals}
                  className="btn">Fetch Provider Deals
                </button>
                <button 
                  onClick={() => wc.resetProviderDeals()}
                  className="btn">Reset
                </button>
                {wc.providerDeals.map((deal:any, i:number) => {
                  return <textarea className="w-full" key={i} defaultValue={JSON.stringify(deal)} />
                })}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Home;