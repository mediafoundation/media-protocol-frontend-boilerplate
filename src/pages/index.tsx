
import type { NextPage } from 'next';
import { useAccount } from 'wagmi';
import { useWalletContext } from '@contexts/WalletContext';
import { useEffect } from 'react';

export function getStaticProps() {
  return {
    props: {
      title: 'Media Protocol Front-End Example',
      isHome: true
    }
  }
}

const Home: NextPage = () => {

  const { isConnected } = useAccount();
  
  const wc = useWalletContext();

  const handleChange = (event: any) => {
    const result = event.target.value.replace(/\D/g, '');
    wc.setMarketplaceId(BigInt(result))
  };

  return (
    <>
        <h1 className="text-3xl font-bold">
          Media Protocol Front-End Example
        </h1>
        <p>
          This is a simple example of how to use the Media Protocol SDK in a Next.js app.
        </p>

        <h1 className="text-3xl font-bold mt-12">
          Select a Marketplace
        </h1>
        <div className='flex gap-2 my-4'>
          {isConnected && (
            <button 
              className="btn" 
              onClick={wc.initMarket}>Init New Marketplace
            </button>
          )}
          <div className='flex gap-2 items-center'>
            or choose ID
            <input 
              className="inputText w-16" 
              type="text" 
              value={String(wc.marketplaceId)} 
              onChange={handleChange}
            />
          </div>
        </div>

    {wc.marketplaceId && ( 
      <>
        <div>
          <button 
            onClick={wc.getMarketplaceData}
            className="btn">Reload
          </button>
          <button 
            onClick={() => wc.resetMarketplaceData()}
            className="btn">Reset
          </button>
        </div>
      </>
    )}
    {wc.marketplaceData && (
      <>
        <h1 className="text-3xl font-bold mt-12">
          Marketplace Data
        </h1>
        <ul>
          <li>Market ID: {String(wc.marketplaceId)}</li>
          <li>Market Fee To: {wc.marketplaceData.marketFeeTo}</li>
          <li>Market Fee Rate: {String(wc.marketplaceData.marketFeeRate)}%</li>
          <li>Required Stake: {String(wc.marketplaceData.requiredStake)}</li>
          <li>Deal Count: {String(wc.marketplaceData.dealCount)}</li>
        </ul>
      </>
    )}
    </>
  );
};

export default Home;