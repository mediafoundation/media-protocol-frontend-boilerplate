import type { NextPage } from "next"
import { useWalletContext } from "@contexts/WalletContext"
import { useEffect, useState } from "react"
import { getShortName } from "@utils/utils"
import { useAccount } from "wagmi"

import { useApproval } from "@hooks/useApproval"
import { Encryption } from "../../../media-sdk"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { formatUnits } from "viem"
import Calculate from "@components/calculate"

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
    if (wc.offers.length == 0 && wc.marketplaceId) {
      wc.fetchOffers()
    }
  }, [wc.marketplaceId])

  const approval = useApproval(
    "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    "0xC32B92D89A88e7f6B236F2024de68b1c0A6e45a4",
    BigInt((2e18).toString())
  )

  const [selectedAmount, setSelectedAmount] = useState("0")

  return (
    <>
      <div>
        <h1>Account</h1>
        <p>
          Here you can register or unregister as a provider, and manage your
          stake.
        </p>
        {wc.marketplaceId && (
          <>
            {isConnected ? (
              <>
                <hr className="border-dark-1500 my-6" />
                {wc.isRegisteredProvider ? (
                  <>
                    <button
                      onClick={() => wc.unregisterProvider()}
                      className="btn"
                    >
                      Unregister Provider
                    </button>
                  </>
                ) : (
                  <div className="[&_>div]:mb-2">
                    <p>
                      Your are currently not registered as a provider, please register.
                    </p>
                    <div>
                      Public Encryption Key:{" "}
                      <input
                        type="text"
                        className="inputText mr-2"
                        value={wc.encryptionPublicKey}
                        onChange={(e) => {
                          wc.setEncryptionPublicKey(e.target.value)
                        }}
                      />
                      <button
                        onClick={wc.getEncryptionPublicKey}
                        className="btn"
                      >
                        Get from Wallet
                      </button>
                    </div>
                    <hr className="border-dark-1500 my-6" />
                    <h1>Calculate required token amounts</h1>
                    <hr className="border-dark-1500 my-6" />
                    <div>
                      <Calculate 
                        required={wc.marketplaceData.requiredStake} 
                        selectedAmount={selectedAmount} 
                        setSelectedAmount={setSelectedAmount} 
                      />
                      {wc.encryptionPublicKey && (
                        <button
                          onClick={() => wc.registerProvider("Provider Label", selectedAmount)}
                          className="btn ml-2"
                        >
                          Register Provider
                        </button>
                      )}
                    </div>
                  </div>
                )}
                {/*<button
                  onClick={() => approval?.approve?.()}
                  className="btn"
                >
                  #2 - Approve Token
                </button> */}
              </>
            ) : (
              <ConnectButton />
            )}
          </>
        )}
      </div>
    </>
  )
}

export default Home
