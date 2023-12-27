import { useWalletContext } from "@contexts/WalletContext"
import { useEffect, useState } from "react"
import { ETH_TOKEN, MEDIA_TOKEN, USDC_TOKEN, WETH_TOKEN, UNI_TOKEN } from "@utils/constants"
import LoadingButton from "@components/LoadingButton"
const { parseUnits, formatUnits } = require("viem")

export default function Calculate({calcProps}: any) {

  const {required, selectedAmount, setSelectedAmount, inputToken, setInputToken} = calcProps



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
  const [liquidity, setLiquidity] = useState(
    formatUnits(required, 18)
  )
  const [requiredAmounts, setRequiredAmounts] = useState(initialRequiredAmounts)
  const [slippage, setSlippage] = useState(0.50)

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
      case "ETH":
        setInputToken(ETH_TOKEN(wc.currentChain))
        break
      case "USDC":
        setInputToken(USDC_TOKEN(wc.currentChain))
        break
      /*       case "MEDIA":
        setInputToken(MEDIA_TOKEN(wc.currentChain));
        break; */
      case "UNI":
        setInputToken(UNI_TOKEN(wc.currentChain))
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

    setRequiredAmounts({
      amount0: formatUnits(amount0.toString(), token0.decimals),
      amount1: formatUnits(amount1.toString(), token1.decimals),
      token0: token0.symbol,
      token1: token1.symbol,
    })

    let required0Half = await getQuote(token0, amount0, inputToken)
    let required1Half = await getQuote(token1, amount1, inputToken)
    let required = required0Half.quote + required1Half.quote;

    if(required) {
      setSelectedAmount(formatUnits(
        required + required * BigInt(slippage * 1000) / BigInt(10000), 
        inputToken.decimals
      ))
    }
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
        <div className="flex gap-3 items-center">
          <span> = </span>
          <div className="space-y-2">
            <div>
              <input
                type="text"
                value={requiredAmounts.amount0}
                className="field"
                disabled
              />
              <span> {requiredAmounts.token0}</span>
            </div>
            <div>
              <input
                type="text"
                value={requiredAmounts.amount1}
                className="field"
                disabled
              />
              <span> {requiredAmounts.token1}</span>
            </div>
          </div>
        </div>

      </div>
      <input 
        type="number"
        className="field w-24 ml-2"
        value={slippage}
        onChange={(e) => setSlippage(Number(e.target.value))}
      /> % Slippage
      <hr className="border-dark-1500 my-6" />
      <LoadingButton
        className="btn"
        onClick={() => calculate(liquidity)}
      >
        Calculate required
      </LoadingButton>
        <select
          className="field ml-2"
          onChange={handleChange}
          value={inputToken.symbol}
        >
          <option>USDC</option>
          <option>UNI</option>
          <option>WETH</option>
          <option>ETH</option>
        </select>
      <hr className="border-dark-1500 my-6" />
      <div>
        <input
          type="text"
          value={selectedAmount}
          className="field"
          onChange={(e) => setSelectedAmount(e.target.value)}
        /> {inputToken.symbol}
      </div>
      <hr className="border-dark-1500 my-6" />
    </>
  )
}

