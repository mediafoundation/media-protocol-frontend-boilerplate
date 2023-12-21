import type { NextPage } from "next";
import { useWalletContext } from "@contexts/WalletContext";
import { useEffect, useState } from "react";

export function getStaticProps() {
  return {
    props: {
      title: 'Quote | Media Protocol Front-End Example',
      isIndex: true
    }
  }
}

const Quote: NextPage = () => {
  const WETH_TOKEN = {
    address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    decimals: 18,
    symbol: "WETH",
  };

  const USDC_TOKEN = {
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    decimals: 6,
    symbol: "USDC",
  };

  const MEDIA_TOKEN = {
    address: "0xb39A46D22Edc66643AB7D23152123DE687Fa69bB",
    decimals: 18,
    symbol: "MEDIA",
  };

  const UNI_TOKEN = {
    address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    decimals: 18,
    symbol: "UNI",
  };

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

  const initialState = { quote: 0, fee: 0 };

  const [inputAmount, setInputAmount] = useState("1.2345");
  const [output, setOutput] = useState(initialState);
  const [inputToken, setInputToken] = useState(UNI_TOKEN);

  const handleChange = (e: any) => {
    switch (e.target.value) {
      /*       case "WETH":
        setInputToken(WETH_TOKEN);
        break; */
      case "USDC":
        setInputToken(USDC_TOKEN);
        break;
      case "MEDIA":
        setInputToken(MEDIA_TOKEN);
        break;
      case "UNI":
        setInputToken(UNI_TOKEN);
        break;
    }
  };

  async function getQuote () {
    let best = { ...initialState };
    if (inputAmount) {
      for (const fee of poolFees) {
        let tradeParams = generateTradeParams({
          inputToken: inputToken,
          amountIn: inputAmount,
          outputToken: WETH_TOKEN,
          poolFee: fee,
        });
        try {
          const quote = await wc.quoter.quote(tradeParams);
          if (quote > best.quote) best = { quote, fee };
        } catch (_) {}
      }
      setOutput(best);
    } else {
      setOutput(best);
    }
  }

  useEffect(() => {
    getQuote();
  }, []);

  return (
    <>
      <h1>Quote</h1>
      <p>Here you can get a quote for a trade.</p>
      <hr className="border-dark-1500 mb-6" />
      <div className="[&_*]:mr-2 [&_*]:mb-2">
        <input
          type="text"
          className="field w-40"
          value={inputAmount}
          onChange={(e) => setInputAmount(e.target.value)}
        />
        <select className="field" onChange={handleChange}>
          <option>UNI</option>
          <option>MEDIA</option>
          <option>USDC</option>
        </select>
        <button
          className="btn"
          onClick={getQuote}
        >
          Quote
        </button>
        <div>
          <input type="text" value={output.quote} className="field" />
          <span>WETH</span>
        </div>
        <span>Best Pool Fee: {output.fee}</span>
      </div>
    </>
  );
};

export default Quote;
