import type { NextPage } from "next"
import { useWalletContext } from "@contexts/WalletContext"
import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import Calculate from "@components/calculate"
import { WETH_TOKEN } from "@utils/constants"
import { Token } from "@uniswap/sdk-core"

declare global {
  interface BigInt {
    toJSON(): string
  }
}

BigInt.prototype.toJSON = function (): string {
  return this.toString()
}

const Home: NextPage = () => {
  const { isConnected } = useAccount()

  const wc = useWalletContext()

  const [selectedAmount, setSelectedAmount] = useState("0")
  const [inputToken, setInputToken] = useState<Token>(WETH_TOKEN())

  useEffect(() => {
    if (wc.offers.length == 0 && wc.marketplaceId) {
      wc.fetchOffers()
    }
  }, [wc.marketplaceId])

  useEffect(() => {
    if (wc.currentChain) {
      setInputToken(WETH_TOKEN(wc.currentChain))
    }
  }, [wc.currentChain])

  const calcProps = {
    required: wc?.marketplaceData?.requiredStake,
    selectedAmount,
    setSelectedAmount,
    inputToken,
    setInputToken,
  }

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
                      Your are currently not registered as a provider, please
                      register.
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
                      <Calculate calcProps={calcProps} />
                      {wc.encryptionPublicKey && (
                        <button
                          onClick={() =>
                            wc.registerProvider({
                              label: "Provider Label",
                              inputToken: inputToken,
                              inputAmount: selectedAmount,
                            })
                          }
                          className="btn"
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
