import type { NextPage } from "next"
import { useWalletContext } from "@contexts/WalletContext"
import { useEffect, useState } from "react"
import { Token } from "@uniswap/sdk-core"
import { MEDIA_TOKEN, USDC_TOKEN, WETH_TOKEN } from "@utils/constants"
import LoadingButton from "@components/LoadingButton"
const { parseUnits, formatUnits } = require("viem")

export default function Calculate({required, selectedAmount, setSelectedAmount}: any) {
  const UNI_TOKEN = new Token(
    1,
    "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    18,
    "UNI",
    "Uniswap"
  )

  const wc = useWalletContext()

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

  const [output, setOutput] = useState(initialState)
  const [inputToken, setInputToken] = useState(UNI_TOKEN)
  const [liquidity, setLiquidity] = useState(
    formatUnits(required, 18)
  )
  const [requiredAmounts, setRequiredAmounts] = useState(initialRequiredAmounts)

  useEffect(() => {
    setSelectedAmount("0")
    setRequiredAmounts(initialRequiredAmounts)
    setOutput(initialState)
  }, [inputToken])

  const handleChange = (e: any) => {
    switch (e.target.value) {
      case "WETH":
        setInputToken(WETH_TOKEN(wc.currentChain))
        break
      case "USDC":
        setInputToken(USDC_TOKEN(wc.currentChain))
        break
      /*       case "MEDIA":
        setInputToken(MEDIA_TOKEN(wc.currentChain));
        break; */
      case "UNI":
        setInputToken(UNI_TOKEN)
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
      MEDIA_TOKEN(wc.currentChain),
      WETH_TOKEN(wc.currentChain)
    )
    let required0Half = await getQuote(token0, amount0, inputToken)
    let required1Half = await getQuote(token1, amount1, inputToken)

    setSelectedAmount((required0Half.quote + required1Half.quote).toString())

    setRequiredAmounts({
      amount0: formatUnits(amount0.toString(), token0.decimals),
      amount1: formatUnits(amount1.toString(), token1.decimals),
      token0: token0.symbol,
      token1: token1.symbol,
    })
  }
  let route =
    wc.quoter && output && wc.quoter.fancyRoute(output.path, output.fees)
  return (
    <>
      <div className="[&_>*]:mb-2">
        <div>
          <input
            type="text"
            className="field"
            value={liquidity}
            onChange={(e) => setLiquidity(e.target.value)}
          /> 
          <span> MEDIA LP</span>
        </div>
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
            value={formatUnits(selectedAmount, inputToken.decimals)}
            className="field mr-2 w-40"
            onChange={(e) => setSelectedAmount(e.target.value)}
          />
          
{/*         <input
          type="text"
          className="field w-40"
          value={inputAmount}
          onChange={(e) => setInputAmount(e.target.value)}
        /> */}
        <select
          className="field"
          onChange={handleChange}
          value={inputToken.symbol}
        >
          <option>USDC</option>
          <option>UNI</option>
          <option>WETH</option>
        </select>
        </div>
      </div>
      <hr className="border-dark-1500 my-6" />
      <LoadingButton
        className="btn w-28"
        onClick={() => calculate(liquidity)}
      >
        Calculate
      </LoadingButton>
    </>
  )
}

