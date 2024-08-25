import type { NextPage } from "next"
import { useAccount } from "wagmi"
import { useWalletContext } from "@contexts/WalletContext"
import LoadingButton from "@components/LoadingButton"
import { useRef } from "react"

export function getStaticProps() {
  return {
    props: {
      title: "Media Protocol Front-End Example",
      isIndex: true,
    },
  }
}

const Home: NextPage = () => {
  const { isConnected, address } = useAccount()

  const wc = useWalletContext()

  const handleChange = (event: any) => {
    const result = event.target.value.replace(/\D/g, "")
    wc.setMarketplaceId(BigInt(result))
  }

  const requiredStakeForm = useRef<HTMLFormElement>(null)

  const setRequiredStake = async () => {
    const form = requiredStakeForm.current;
    if (!form || !isConnected) return;
    const data = new FormData(form)

    await wc.marketplace.execute("setRequiredStake", [
      wc.marketplaceId,
      data.get("requiredStake"),
    ])
  }

  const marketFeeRateForm = useRef<HTMLFormElement>(null)

  const setMarketFeeRate = async () => {
    const form = marketFeeRateForm.current;
    if (!form || !isConnected) return;
    const data = new FormData(form)
    
    await wc.marketplace.execute("setMarketFeeRate", [
      wc.marketplaceId,
      data.get("marketFeeRate"),
    ])
  }

  const marketFeeToForm = useRef<HTMLFormElement>(null)

  const setMarketFeeTo = async () => {
    const form = marketFeeToForm.current;
    if (!form || !isConnected) return;
    const data = new FormData(form)
    
    await wc.marketplace.execute("setMarketFeeTo", [
      wc.marketplaceId,
      data.get("marketFeeTo"),
    ])
  }

  return (
    <>
      <h1>Media Protocol Front-End Example</h1>
      <p>
        This is a simple example of how to use the Media Protocol SDK in a
        Next.js app.
      </p>
      <hr className="border-dark-1500 mb-6" />
      <h1>Select a Marketplace</h1>
      <div className="flex gap-2 my-4">
        {isConnected && (
          <LoadingButton className="btn" onClick={wc.initMarket}>
            Init New Marketplace
          </LoadingButton>
        )}
        <div className="flex gap-2 items-center">
          or choose ID
          <input
            className="inputText w-16"
            type="text"
            value={String(wc.marketplaceId)}
            onChange={handleChange}
          />
        </div>
      </div>
      {wc.marketplaceData && (
        <div className="mt-4 border border-dark-1500 rounded-xl px-5">
          <h1 className="mt-6 pb-3 border-b border-dark-1500">Marketplace Data</h1>
          <ul className="divide-y divide-dark-1500 [&_li]:py-3 ">
            <li>Market ID: {String(wc.marketplaceId)}</li>
            <li>Market Fee To:
              <form ref={marketFeeToForm}>
                <input
                  className="field mr-2"
                  type="text"
                  name="marketFeeTo"
                  value={wc.marketplaceData.marketFeeTo}
                  onChange={(e) => {
                    wc.setMarketplaceData({
                      ...wc.marketplaceData,
                      marketFeeTo: e.target.value,
                    })
                  }}
                />
                {isConnected && address == wc.marketplaceData.owner && (<>
                  <LoadingButton 
                    type="submit" 
                    className="btn" 
                    onClick={async(event: React.MouseEvent<HTMLButtonElement>) => {
                      event.preventDefault();
                      await setMarketFeeTo();
                    }}
                  >
                    Submit
                  </LoadingButton>
                </>)}
              </form>            
            </li>
            <li>
              Market Fee Rate: <small>From 100 (0.01%) to 100000 (10%)</small>
              <form ref={marketFeeRateForm}>
                <input
                  className="field mr-2"
                  type="text"
                  name="marketFeeRate"
                  value={String(wc.marketplaceData.marketFeeRate)}
                  onChange={(e) => {
                    wc.setMarketplaceData({
                      ...wc.marketplaceData,
                      marketFeeRate: e.target.value,
                    })
                  }}
                />
                {isConnected && address == wc.marketplaceData.owner && (<>
                  <LoadingButton 
                    type="submit" 
                    className="btn" 
                    onClick={async(event: React.MouseEvent<HTMLButtonElement>) => {
                      event.preventDefault();
                      await setMarketFeeRate();
                    }}
                  >
                    Submit
                  </LoadingButton>
                </>)}
              </form>
            </li>
            <li>
              Required Stake:{" "}
              <form ref={requiredStakeForm}>
                <input
                  className="field mr-2"
                  name="requiredStake"
                  type="text"
                  value={String(wc.marketplaceData.requiredStake)}
                  onChange={(e) => {
                    wc.setMarketplaceData({
                      ...wc.marketplaceData,
                      requiredStake: BigInt(e.target.value),
                    })
                  }}
                />
                {isConnected && address == wc.marketplaceData.owner && (<>
                  <LoadingButton 
                    type="submit" 
                    className="btn" 
                    onClick={async(event: React.MouseEvent<HTMLButtonElement>) => {
                      event.preventDefault();
                      await setRequiredStake();
                    }}
                  >
                    Submit
                  </LoadingButton>
                </>)}
              </form>
            </li>
            <li>Deal Count: {String(wc.marketplaceData.dealCount)}</li>
            <li>Offer Count: {String(wc.marketplaceData.offerCount)}</li>
          </ul>
        </div>
      )}
      <hr className="border-dark-1500 my-6" />
      {wc.marketplaceId && (
        <div className="flex gap-2">
          <LoadingButton onClick={wc.getMarketplaceData} className="btn">
            Reload
          </LoadingButton>
          <LoadingButton onClick={wc.resetMarketplaceData} className="btn">
            Reset
          </LoadingButton>
        </div>
      )}
    </>
  )
}

export default Home
