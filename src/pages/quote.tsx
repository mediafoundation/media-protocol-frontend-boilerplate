import type { NextPage } from "next"
import { useWalletContext } from "@contexts/WalletContext"
import { useEffect, useState } from "react"
import { Token } from "@uniswap/sdk-core"
import { MEDIA_TOKEN, UNI_TOKEN, USDC_TOKEN, WETH_TOKEN } from "@utils/constants"
import LoadingButton from "@components/LoadingButton"
const { parseUnits, formatUnits } = require("viem")

export function getStaticProps() {
  return {
    props: {
      title: "Quote | Media Protocol Front-End Example",
      isIndex: true,
    },
  }
}

const Quote: NextPage = () => {


  const wc = useWalletContext()

  let chainId = wc.currentChain || 5

  useEffect(() => {
    if (wc.currentChain) {
      setInputToken(USDC_TOKEN(wc.currentChain))
    }
  }, [wc.currentChain])

  useEffect(() => {
    if (wc.offers.length == 0 && wc.marketplaceId) {
      wc.fetchOffers()
    }
  }, [wc.marketplaceId])



  const initialState = { quote: 0, fee: 0, route: "", path: [], fees: [] }
  const initialRequiredAmounts = {
    amount0: 0,
    amount1: 0,
    token0: "",
    token1: "",
  }

  const [inputAmount, setInputAmount] = useState("1.2345")
  const [output, setOutput] = useState(initialState)
  const [inputToken, setInputToken] = useState(USDC_TOKEN(chainId))
  const [liquidity, setLiquidity] = useState(
    formatUnits("1357149080105453931", 18)
  )
  const [requiredAmounts, setRequiredAmounts] = useState(initialRequiredAmounts)
  const [totalRequired, setTotalRequired] = useState(0)

  useEffect(() => {
    setTotalRequired(0)
    setRequiredAmounts(initialRequiredAmounts)
    setOutput(initialState)
  }, [inputToken])

  const handleChange = (e: any) => {
    switch (e.target.value) {
      case "WETH":
        setInputToken(WETH_TOKEN(chainId))
        break
      case "USDC":
        setInputToken(USDC_TOKEN(chainId))
        break
      /*       case "MEDIA":
        setInputToken(MEDIA_TOKEN(chainId));
        break; */
      case "UNI":
        setInputToken(UNI_TOKEN(chainId))
        break
    }
  }

  async function getQuote(inputToken: any, amountIn: any, outputToken: any) {
    let best = await wc.quoter.getQuote(inputToken, amountIn, outputToken)
    return best
  }

  async function calculate(liquidity: any) {
    let { token0, token1, amount0, amount1 } = await wc.quoter.mintAmounts(
      parseUnits(liquidity, 18).toString(),
      MEDIA_TOKEN(chainId),
      WETH_TOKEN(chainId)
    )
    let required0Half = await getQuote(token0, amount0, inputToken)
    let required1Half = await getQuote(token1, amount1, inputToken)

    setTotalRequired(required0Half.quote + required1Half.quote)

    setRequiredAmounts({
      amount0: formatUnits(amount0.toString(), token0.decimals),
      amount1: formatUnits(amount1.toString(), token1.decimals),
      token0: token0.symbol,
      token1: token1.symbol,
    })
  }
  console.log(wc.quoter)
  let route =
    wc.quoter && output && wc.quoter.fancyRoute(output.path, output.fees)

  return (
    <>
      <h1>Quote</h1>
      <p>Here you can get a quote for trading any token for MEDIA.</p>
      <hr className="border-dark-1500 mb-6" />
      <div className="[&_>*]:mr-2 [&_>*]:mb-2">
        <input
          type="text"
          className="field w-40"
          value={inputAmount}
          onChange={(e) => setInputAmount(e.target.value)}
        />
        <select
          className="field"
          onChange={handleChange}
          value={inputToken.symbol}
        >
          <option>USDC</option>
          <option>UNI</option>
          <option>WETH</option>
        </select>
        <LoadingButton
          className="btn"
          onClick={async () =>
            setOutput(
              await getQuote(
                inputToken,
                parseUnits(inputAmount, inputToken.decimals),
                MEDIA_TOKEN(chainId)
              )
            )
          }
        >
          Quote
        </LoadingButton>
        <div>
          <input
            type="text"
            value={formatUnits(
              output.quote,
              MEDIA_TOKEN(chainId).decimals
            )}
            className="field"
          />
          <span> MEDIA</span>
        </div>
        <span className="text-dark-300 text-sm pl-3">{route}</span>
      </div>

      <hr className="border-dark-1500 my-8" />

      <h1>Calculate required token amounts</h1>
      <p>
        Here you can calculate the amounts of MEDIA and WETH required to mint a
        full range position for a given liquidity.
      </p>
      <hr className="border-dark-1500 mb-6" />
      <div className="[&_>*]:mr-2 [&_>*]:mb-2">
        <input
          type="text"
          className="field w-40"
          value={liquidity}
          onChange={(e) => setLiquidity(e.target.value)}
        />
        <LoadingButton
          className="btn w-24"
          onClick={() => calculate(liquidity)}
        >
          Calculate
        </LoadingButton>
        <div>
          <input
            type="text"
            value={requiredAmounts.amount0}
            className="field"
          />
          <span> {requiredAmounts.token0}</span>
        </div>
        <div>
          <input
            type="text"
            value={requiredAmounts.amount1}
            className="field"
          />
          <span> {requiredAmounts.token1}</span>
        </div>
        <div className="border-t border-dark-1500 pt-2">
          <input
            type="text"
            value={formatUnits(totalRequired, inputToken.decimals)}
            className="field"
          />
          <span> {inputToken.symbol} </span>
        </div>
      </div>
    </>
  )
}

export default Quote
