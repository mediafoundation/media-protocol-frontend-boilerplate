import type { NextPage } from "next"
import { useAccount } from "wagmi"
import { useWalletContext } from "@contexts/WalletContext"
import { useEffect } from "react"
import Deals from "@components/Deals"

const Home: NextPage = () => {
  const { address, isConnected } = useAccount()

  const wc = useWalletContext()

  useEffect(() => {
    if (
      wc.sdkReady &&
      wc.clientDeals.length == 0 &&
      isConnected &&
      wc.marketplaceId
    ) {
      wc.fetchClientDeals()
    }
  }, [isConnected, wc.sdkReady, wc.marketplaceId])

  useEffect(() => {
    if (wc.sdkReady && wc.marketplaceId) {
      wc.fetchClientDeals()
    }
  }, [address])

  return (
    <>
      <h1>Deals as Client</h1>
      <p>Here you can view all the deals you have as a provider.</p>

      {wc.marketplaceId && (
        <>
          {isConnected && (
            <>
              <div>
                <div className="flex gap-2">
                  <button onClick={wc.fetchClientDeals} className="btn">
                    Reload
                  </button>
                  <button onClick={() => wc.resetClientDeals()} className="btn">
                    Reset
                  </button>
                </div>
                <Deals items={wc.clientDeals} />
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}

export default Home
