import type { NextPage } from "next";
import { useWalletContext } from "@contexts/WalletContext";
import { useEffect, useState } from "react";
import uniswapCalculator from "./calculate";
import { Token } from "@uniswap/sdk-core";
const { parseUnits, formatUnits } = require("viem");

export function getStaticProps() {
  return {
    props: {
      title: "Quote | Media Protocol Front-End Example",
      isIndex: true,
    },
  };
}

const Quote: NextPage = () => {
  const WETH_TOKEN = new Token(
    1,
    "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    18,
    "WETH",
    "Weth"
  );

  const USDC_TOKEN = new Token(
    1,
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    6,
    "USDC",
    "USD Coin"
  );

  const MEDIA_TOKEN = new Token(
    1,
    "0xb39A46D22Edc66643AB7D23152123DE687Fa69bB",
    18,
    "MEDIA",
    "Media"
  );

  const UNI_TOKEN = new Token(
    1,
    "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    18,
    "UNI",
    "Uniswap"
  );

  const poolFees = [100, 500, 3000, 10000];

  const generateTradeParams = ({
    inputToken,
    amountIn,
    outputToken,
    poolFee,
  }: any) => ({
    in: inputToken,
    amountIn: amountIn,
    out: outputToken,
    poolFee: poolFee,
  });

  const wc = useWalletContext();

  useEffect(() => {
    if (wc.offers.length == 0 && wc.marketplaceId) {
      wc.fetchOffers();
    }
  }, [wc.marketplaceId]);

  const initialState = { quote: 0, fee: 0, route: "" };

  const [inputAmount, setInputAmount] = useState("1.2345");
  const [output, setOutput] = useState(initialState);
  const [inputToken, setInputToken] = useState(UNI_TOKEN);
  const [liquidity, setLiquidity] = useState(
    formatUnits("1357149080105453931", 18)
  );
  const [requiredAmounts, setRequiredAmounts] = useState({
    amount0: 0,
    amount1: 0,
  });
  const [totalRequired, setTotalRequired] = useState(0);

  const handleChange = (e: any) => {
    switch (e.target.value) {
      case "WETH":
        setInputToken(WETH_TOKEN);
        break;
      case "USDC":
        setInputToken(USDC_TOKEN);
        break;
      /*       case "MEDIA":
        setInputToken(MEDIA_TOKEN);
        break; */
      case "UNI":
        setInputToken(UNI_TOKEN);
        break;
    }
  };

  async function getQuote(inputToken: any, amountIn: any, outputToken: any) {
    if (!amountIn || inputToken === outputToken) {
        return { ...initialState };
    }

    let best = { ...initialState };
    let bestViaWeth = { ...initialState };

    const getBestQuote = async (inToken: any, outToken: any, amount: any, updateBest: any) => {
        for (const fee of poolFees) {
            const tradeParams = generateTradeParams({ inputToken: inToken, amountIn: amount, outputToken: outToken, poolFee: fee });
            try {
                const quote = await wc.quoter.quote(tradeParams);
                if (quote > updateBest.quote) {
                    updateBest.quote = quote;
                    updateBest.fee = fee;
                    updateBest.route = inToken.symbol === outToken.symbol ? '' : `${inToken.symbol} -> ${outToken.symbol} (${fee})`;
                }
            } catch (_) {}
        }
    };

    // Direct quote from inputToken to outputToken
    await getBestQuote(inputToken, outputToken, amountIn, best);

    // Quote from inputToken to WETH
    await getBestQuote(inputToken, WETH_TOKEN, amountIn, bestViaWeth);

    // If quote via WETH is possible, check for a quote from WETH to outputToken
    if (bestViaWeth.quote > 0) {
        let bestWethToOutput = { ...initialState };
        await getBestQuote(WETH_TOKEN, outputToken, bestViaWeth.quote, bestWethToOutput);

        if (bestWethToOutput.quote > best.quote) {
            return {
                quote: bestWethToOutput.quote,
                fee: bestViaWeth.fee, // Fee for inputToken to WETH
                route: `${inputToken.symbol} -> WETH (${bestViaWeth.fee}) -> ${outputToken.symbol} (${bestWethToOutput.fee})`
            };
        }
    }

    return best;
}


  async function calculate(liquidity: any) {
    let { amount0, amount1 } = await uniswapCalculator(
      wc,
      parseUnits(liquidity, 18).toString(),
      MEDIA_TOKEN,
      WETH_TOKEN
    );
    console.log(amount0.toString());
    console.log(amount1.toString());
    let required0Half = await getQuote(MEDIA_TOKEN, formatUnits(amount0, MEDIA_TOKEN.decimals), UNI_TOKEN);
    let required1Half = await getQuote(WETH_TOKEN, formatUnits(amount1, WETH_TOKEN.decimals), UNI_TOKEN);
    console.log("required0Half",required0Half);
    console.log("required1Half",required1Half);
    console.log("total",Number(required0Half.quote) + Number(required1Half.quote));
    setTotalRequired(Number(required0Half.quote) + Number(required1Half.quote));

    setRequiredAmounts({
      amount0: formatUnits(amount0.toString(), MEDIA_TOKEN.decimals),
      amount1: formatUnits(amount1.toString(), WETH_TOKEN.decimals),
    });
  }

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
        <select className="field" onChange={handleChange}>
          <option>UNI</option>
          <option>WETH</option>
          <option>USDC</option>
        </select>
        <button
          className="btn"
          onClick={async () =>
            setOutput(await getQuote(inputToken, inputAmount, MEDIA_TOKEN))
          }
        >
          Quote
        </button>
        <div>
          <input type="text" value={output.quote} className="field" />
          <span> MEDIA</span>
        </div>
        <span>Route: {output.route}</span>
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
        <button className="btn" onClick={() => calculate(liquidity)}>
          Calculate
        </button>
        <div>
          <input
            type="text"
            value={requiredAmounts.amount0}
            className="field"
          />
          <span> MEDIA</span>
        </div>
        <div>
          <input
            type="text"
            value={requiredAmounts.amount1}
            className="field"
          />
          <span> WETH</span>
        </div>
        <div className="border-t border-dark-1500 pt-2">
          <input
            type="text"
            value={totalRequired}
            className="field"
          />
          <span> UNI Required</span>
        </div>
      </div>
    </>
  );
};

export default Quote;
