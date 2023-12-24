import { Token, WETH9 } from "@uniswap/sdk-core";
import { Addresses } from "../../../media-sdk";

export const WETH_TOKEN = (chainId: number) => {
  if(chainId == 84531) {
    return new Token(
      chainId,
      Addresses.WETH9["84531"],
      18,
      "WETH",
      "Wrapped Ether"
    )
  } else {
    return WETH9[chainId];
  }
}

export function MEDIA_TOKEN(chainId: string = "5") {

  let address = Addresses.MediaERC20[chainId as keyof typeof Addresses.MediaERC20 || "5"];
  return new Token(
    Number(chainId),
    address,
    18,
    "MEDIA",
    "Media Token"
  )
};

export function USDC_TOKEN(chainId: string = "5") {

  let address = Addresses.USDC[chainId as keyof typeof Addresses.USDC || "5"];
  return new Token(
    Number(chainId),
    address,
    6,
    "USDC",
    "USD//C"
  )
};