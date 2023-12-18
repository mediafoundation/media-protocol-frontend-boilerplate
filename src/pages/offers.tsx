import type { NextPage } from "next";
import { useWalletContext } from "@contexts/WalletContext";
import { useEffect } from "react";
import { getShortName } from "@utils/utils";
import { useAccount } from "wagmi";

import { Uniswap } from "../../../media-sdk";
import CreateOffer from "@components/CreateOffer";

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function (): string {
  return this.toString();
};

const Home: NextPage = () => {
  /* let path = Uniswap.encodePath(
    [
      "0x6b175474e89094c44da98b954eedeac495271d0f",
      "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    ],
    [500]
  );
  console.log("path", path);

  let decodedPath = Uniswap.decodePath(path);
  console.log("decodedPath", decodedPath);

  let sqrtX96 = Uniswap.calculateSqrtPriceX96("185", "1");
  console.log(sqrtX96.toFixed(0)); */

  const { isConnected } = useAccount();

  const wc = useWalletContext();

  useEffect(() => {
    if (wc.offers.length == 0 && wc.marketplaceId) {
      wc.fetchOffers();
    }
  }, [wc.marketplaceId]);

  return (
    <>
      <div className="">
        <h1>Offers</h1>
        <p>
          Here you can view all the offers on the selected marketplace, and
          create new ones.
        </p>
        <hr className="border-dark-1500 mb-6" />
        {wc.marketplaceId && (
          <>
            <div>
              <button onClick={wc.fetchOffers} className="btn">
                Reload
              </button>
              <button onClick={() => wc.resetOffers()} className="btn">
                Reset
              </button>
              <table className="divide-y divide-dark-1500 text-center">
                <tr className="[&_th]:font-semibold [&_th]:px-3">
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
                  {isConnected && <th>Actions</th>}
                </tr>
                {wc.offers.map((offer: any, i: number) => {
                  console.log(offer);
                  return (
                    <tr key={i}>
                      <td>{String(offer.id)}</td>
                      <td>{getShortName(offer.provider, true)}</td>
                      <td>{String(offer.maximumDeals)}</td>
                      <td>{offer.autoAccept.toString()}</td>
                      <td>{String(offer.terms.pricePerSecond)}</td>
                      <td>{String(offer.terms.minDealDuration)}</td>
                      <td>{offer.terms.billFullPeriods.toString()}</td>
                      <td>{offer.terms.singlePeriodOnly.toString()}</td>
                      <td title={offer.publicKey}>
                        {offer.publicKey.slice(0, 5)}...
                      </td>
                      <td>
                        <textarea
                          className="w-full"
                          defaultValue={offer.metadata}
                        />
                      </td>
                      {isConnected && (
                        <td>
                          <button
                            onClick={() => {
                              wc.marketplaceHelper.swapAndCreateDealWithETH({
                                marketplaceId: wc.marketplaceId,
                                resourceId: 0,
                                offerId: offer.id,
                                sharedKeyCopy: "null",
                                minMediaAmountOut: 0,
                                amount: 25e14.toString(),
                              });
                            }}
                            className="btn"
                          >
                            Take Offer
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </table>
            </div>
            {isConnected && (
              <>
                <hr className="border-dark-1500 my-6" />
                <h3 className="text-2xl font-bold">Create Offer</h3>
                {wc.isRegisteredProvider ? (
                  <>
                    <CreateOffer />
                    <button
                      onClick={() => wc.unregisterProvider()}
                      className="btn"
                    >
                      Unregister Provider
                    </button>
                  </>
                ) : (
                  <div>
                    <div className="my-4">
                      Please register as a provider below in order to create
                      offers.
                    </div>
                    {!wc.encryptionPublicKey ? (
                      <button
                        onClick={wc.getEncryptionPublicKey}
                        className="btn"
                      >
                        #1 - Get Encryption Key
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => wc.registerProvider("Provider Label")}
                          className="btn"
                        >
                          #2 - Register Provider
                        </button>
                        Public Encryption Key:{" "}
                        <input
                          type="text"
                          className="inputText"
                          defaultValue={wc.encryptionPublicKey}
                        />
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Home;
