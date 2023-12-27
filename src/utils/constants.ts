import { Token } from "@uniswap/sdk-core"
//@ts-ignore
import { Addresses } from 'media-sdk';
/* import { Addresses } from "../../../media-sdk" */
const Tokens = Addresses as any

export const ETH_TOKEN = (chainId: number = 5) => {
  return new Token(chainId, Tokens.WETH9[chainId], 18, "ETH", "Native Ether")
}

export const WETH_TOKEN = (chainId: number = 5) => {
  return new Token(chainId, Tokens.WETH9[chainId], 18, "WETH", "Wrapped Ether")
}

export const MEDIA_TOKEN = (chainId: number = 5) => {
  return new Token(
    chainId,
    Tokens.MediaERC20[chainId],
    18,
    "MEDIA",
    "Media Token"
  )
}

export const USDC_TOKEN = (chainId: number = 5) => {
  return new Token(chainId, Tokens.USDC[chainId], 6, "USDC", "USD//C")
}

export const UNI_TOKEN = (chainId: number = 5) => {
  return new Token(
    chainId,
    "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    18,
    "UNI",
    "Uniswap"
  )
}
