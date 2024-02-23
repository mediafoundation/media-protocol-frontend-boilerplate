import type { NextPage } from "next"
import { useAccount } from "wagmi"
import { useWalletContext } from "@contexts/WalletContext"

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

  const setRequiredStake = async (event: any) => {
    event.preventDefault()
    if(!isConnected) return false
    const data = new FormData(event.target)

    const tx: any = await wc.marketplace.execute("setRequiredStake", [
      wc.marketplaceId,
      data.get("requiredStake"),
    ])
    console.log(tx)
  }

  const setMarketFeeRate = async (event: any) => {
    event.preventDefault()
    if(!isConnected) return false
    const data = new FormData(event.target)

    const tx: any = await wc.marketplace.execute("setMarketFeeRate", [
      wc.marketplaceId,
      data.get("marketFeeRate"),
    ])
    console.log(tx)
  }

  const setMarketFeeTo = async (event: any) => {
    event.preventDefault()
    if(!isConnected) return false
    const data = new FormData(event.target)

    const tx: any = await wc.marketplace.execute("setMarketFeeTo", [
      wc.marketplaceId,
      data.get("marketFeeTo"),
    ])
    console.log(tx)
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
          <button className="btn" onClick={wc.initMarket}>
            Init New Marketplace
          </button>
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
              <form onSubmit={setMarketFeeTo}>
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
                {isConnected && address == wc.marketplaceData.owner && (<><input type="submit" className="btn" /></>)}
              </form>            
            </li>
            <li>
              Market Fee Rate: <small>From 100 (0.01%) to 100000 (10%)</small>
              <form onSubmit={setMarketFeeRate}>
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
                {isConnected && address == wc.marketplaceData.owner && (<><input type="submit" className="btn" /></>)}
              </form>
            </li>
            <li>
              Required Stake:{" "}
              <form onSubmit={setRequiredStake}>
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
                {isConnected && address == wc.marketplaceData.owner && (<><input type="submit" className="btn" /></>)}
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
          <button onClick={wc.getMarketplaceData} className="btn">
            Reload
          </button>
          <button onClick={() => wc.resetMarketplaceData()} className="btn">
            Reset
          </button>
        </div>
      )}
    </>
  )
}

export default Home
