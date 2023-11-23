
import type { NextPage } from 'next';
import { useWalletContext } from '@contexts/WalletContext';
import Link from 'next/link';
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

  const wc = useWalletContext();

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    const data = new FormData(event.target);

    /* console.log("isregistered",await wc.isRegisteredProvider(address)); */

    const tx: any = await wc.createOffer(
      data.get('maximumDeals'),
      data.get('autoAccept') === 'on' ? true : false,
      data.get('pricePerSecond') ,
      data.get('minDealDuration'),
      data.get('billFullPeriods') === 'on' ? true : false,
      data.get('singlePeriodOnly') === 'on' ? true : false,
      data.get('metadata')
    )
    console.log(tx)
  }

  useEffect(() => {
    if (wc.offers.length == 0 && wc.marketplaceId) {
      wc.fetchOffers()
    }
  }, [wc.marketplaceId])

  return (
    <>
      <div className=''>
        <h1 className="text-3xl font-bold">
          Offers
        </h1>
        <p>
          Here you can view all the offers on the selected marketplace, and create new ones.
        </p>        
        {wc.marketplaceId && ( 
          <>

            <div>
              <button 
                onClick={wc.fetchOffers}
                className="btn">Reload
              </button>
              <button 
                onClick={() => wc.resetOffers()}
                className="btn">Reset
              </button>
              <table>
                <tr>
                  <th>ID</th>
                  <th>Provider</th>
                  <th>Maximum Deals</th>
                  <th>Auto Accept</th>
                  <th>Price Per Second</th>
                  <th>Min Deal Duration</th>
                  <th>Bill Full Periods</th>
                  <th>Single Period Only</th>
                  <th>Public Key</th>
                  <th>Metadata</th>
                  <th>Actions</th>
                </tr>
              {wc.offers.map((offer:any, i:number) => {

                return (

                  <tr key={i}>
                    <td>{offer.id}</td>
                    <td><textarea className="w-full" defaultValue={offer.provider} /></td>
                    <td>{String(offer.maximumDeals)}</td>
                    <td>{offer.autoAccept.toString()}</td>
                    <td>{String(offer.pricePerSecond)}</td>
                    <td>{String(offer.minDealDuration)}</td>
                    <td>{offer.billFullPeriods.toString()}</td>
                    <td>{offer.singlePeriodOnly.toString()}</td>
                    <td><textarea className="w-full" defaultValue={offer.publicKey} /></td>
                    <td><textarea className="w-full" defaultValue={offer.metadata} /></td>
                    <td><button 
                      onClick={() => {
                        console.log(offer.pricePerSecond * offer.minDealDuration, offer.id)
                        wc.helper.execute(
                          "swapAndCreateDealWithETH",
                          [wc.marketplaceId, 0, offer.id, "null"],
                          offer.pricePerSecond * offer.minDealDuration
                        )
                      }}
                      className="btn">Take Offer
                    </button></td>
                  </tr>
                )
              })}
              </table>
            </div>
            <hr className='my-16'/>
            <h3 className="text-2xl font-bold">
              Create Offer
            </h3>
            {wc.isRegisteredProvider ? ( 
              <form onSubmit={handleSubmit}>
                <fieldset className='rounded border'>
                  <legend>Create Offer</legend>
                  <label htmlFor="maximumDeals">Maximum Deals</label>
                  <input id="maximumDeals" name="maximumDeals" type="text" className="inputText" defaultValue={"100"} /><br/>
                  <label htmlFor="autoAccept">Auto Accept</label>
                  <input id="autoAccept" name="autoAccept" type="checkbox" defaultChecked={true} /><br/>
                  <label htmlFor="pricePerSecond">Price Per Second</label>
                  <input id="pricePerSecond" name="pricePerSecond" type="text" className="inputText" defaultValue={"100"}/><br/>
                  <label htmlFor="minDealDuration">Min Deal Duration</label>
                  <input id="minDealDuration" name="minDealDuration" type="text" className="inputText" defaultValue={"15"}/><br/>
                  <label htmlFor="billFullPeriods">Bill Full Periods</label>
                  <input id="billFullPeriods" name="billFullPeriods" type="checkbox" /><br/>
                  <label htmlFor="singlePeriodOnly">Single Period Only</label>
                  <input id="singlePeriodOnly" name="singlePeriodOnly" type="checkbox" /><br/>
                  <label htmlFor="metadata">Metadata</label>
                  <input id="metadata" name="metadata" type="text" className="inputText" defaultValue={`{"thing":"thong"}`}/><br/>
                  <button type="submit" className="btn">Create Offer</button>
                </fieldset>
              </form>
            ) : (
              <div>
                <div className='my-4'>Please <Link href="/register">register</Link> as a provider to create offers</div>
                {!wc.encryptionPublicKey ? (
                    <button
                      onClick={wc.getEncryptionPublicKey}
                      className="btn">Get Encryption Key
                    </button>
                ) : (
                  <>
                    <input type="text" className="inputText" defaultValue={wc.encryptionPublicKey} />
                    <button onClick={() => wc.registerProvider("Provider Label")} className="btn">Register Provider</button>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Home;