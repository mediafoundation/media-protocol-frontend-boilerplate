import type { NextPage } from 'next';
import { useAccount, useNetwork } from 'wagmi';
import { useWalletContext } from '@contexts/WalletContext';
import { useEffect } from 'react';
//@ts-ignore
import { Encryption } from 'media-sdk';
import { getShortName } from '@utils/utils';

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function (): string {
  return this.toString();
};

export function getStaticProps() {
  return {
    props: {
      title: 'Resources | Media Protocol Front-End Example',
      isIndex: true
    }
  }
}

const Home: NextPage = () => {

  const { address, isConnected } = useAccount();
  
  const wc = useWalletContext();
  

  useEffect(() => {
    if (wc.sdkReady && wc.resources.length == 0 && isConnected) {
      wc.fetchResources()
    }
  }, [address, isConnected, wc.sdkReady])

/*   useEffect(() => {
    if (wc.sdkReady) {
      wc.fetchResources()
    }
  }, [address]) */

  return (
    <>
      <h1 className="text-3xl font-bold">
        Resources
      </h1>
      <p>
      A Resource in Media Protocol refers to a JSON-encrypted object stored on the blockchain. The purpose of this object is to store private user information, such as email, name, and address. The encrypted information can only be decrypted using the user&#39;s private key. The user can share this information with a provider, who can then decrypt it and use it to deliver services. Here, you will find the list of resources you own and those shared with you.
      </p>
      {isConnected && (
        <div>
          <button 
            onClick={wc.fetchResources}
            className="btn">Reload
          </button>
          <button 
            onClick={wc.resetResources}
            className="btn">Reset
          </button>
          {wc.resources.map((res:any, i:number) => {
            return (
              <ul key={i}>
                <li className='border border-neutral-800 rounded-xl px-6 py-4 my-2'>
                  <div className='flex items-center justify-between'>
                    <span className="text-xl leading-9">#{String(res.id)} - {getShortName(res.owner,true,6)}</span>
                    {!wc.decryptedResources[res.id] && (
                      <button 
                        onClick={async() => {
                          console.log(wc)
                          const decryptedKey = await wc.provider.request({
                            method: "eth_decrypt",
                            params: [res.encryptedSharedKey, address],
                          });
                          console.log("decryptedKey",decryptedKey)
                          let attrs = JSON.parse(res.encryptedData);
                          let decryptedData = await Encryption.decrypt(
                            decryptedKey,
                            attrs.iv,
                            attrs.tag,
                            attrs.encryptedData
                          );
                          let data = JSON.parse(decryptedData);
                          wc.setDecryptedResources({...wc.decryptedResources, [res.id]: data})
                          console.log(data)
                        }}
                        className="btn !m-0">Decrypt
                      </button>
                    )}
                  </div>

                  {wc.decryptedResources[res.id] && (
                    <ul className='border-t border-t-neutral-800 mt-2 pt-2'>
                      {Object.entries(wc.decryptedResources[res.id]).map(([key, value]) => (
                        <li key={key}>
                          {key}: {JSON.stringify(value)}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
            </ul> 
            )
          })}
        </div>
      )}
    
    </>
  );
};

export default Home;