
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
    if (wc.clientDeals.length == 0 && isConnected && wc.marketplaceId) {
      wc.fetchClientDeals()
    }
  }, [address, isConnected, wc.marketplaceId])

  return (
    <>
      <h1 className="text-3xl font-bold">
        Deals as Client
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
                  onClick={wc.fetchClientDeals}
                  className="btn">Fetch Client Deals
                </button>
                <button 
                  onClick={() => wc.resetClientDeals()}
                  className="btn">Reset
                </button>
                {wc.clientDeals.map((deal:any, i:number) => {
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