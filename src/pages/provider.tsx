import type { NextPage } from "next"
import { useAccount } from "wagmi"
import { useWalletContext } from "@contexts/WalletContext"
import { useEffect } from "react"
import Deals from "@components/Deals"
import LoadingButton from "@components/LoadingButton"

declare global {
  interface BigInt {
    toJSON(): string
  }
}

BigInt.prototype.toJSON = function (): string {
  return this.toString()
}

const Home: NextPage = () => {
  const { address, isConnected } = useAccount()

  const wc = useWalletContext()

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
      <h1>Deals as Provider</h1>
      <p>Here you can view all the deals you have as a provider.</p>
      {wc.marketplaceId && (
        <>
          {isConnected && (
            <>
              <div>
                <div className="flex gap-2">
                  <LoadingButton onClick={wc.fetchProviderDeals} className="btn">
                    Reload
                  </LoadingButton>
                  <LoadingButton onClick={wc.resetProviderDeals} className="btn">
                    Reset
                  </LoadingButton>
                </div>
                <Deals items={wc.providerDeals} />
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}

export default Home
