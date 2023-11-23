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
    if (wc.sdkReady && wc.resources.length == 0 && isConnected) {
      wc.fetchResources()
    }
  }, [address, isConnected, wc.sdkReady])

  return (
    <>
        <h1 className="text-3xl font-bold">
          Resources
        </h1>
        <p>
          A Resource in Media Protocol refers to a JSON-encrypted object stored on the blockchain. This object&#39;s purpose is to store any private user information, some examples include: email, name, address, etc. The information, encrypted, can only be decrypted using the user&#39;s private key. The user can share this information with a provider, who can then decrypt it and use it to deliver services to the user.
        </p>
        <div className='grid grid-cols-3 gap-2'>
          {isConnected && (
            <div>
              <button 
                onClick={wc.fetchResources}
                className="btn">Fetch Resources
              </button>
              <button 
                onClick={wc.resetResources}
                className="btn">Reset
              </button>
              {wc.resources.map((resource:any, i:number) => {
                return <textarea className="w-full" key={i} defaultValue={JSON.stringify(resource)} />
              })}
            </div>
          )}
        </div>
    
    </>
  );
};

export default Home;