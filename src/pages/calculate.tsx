import { Pool, Position, FeeAmount } from "@uniswap/v3-sdk";

const uniswapCalculator = async (
  wc: any,
  liquidity: any,
  token0: any,
  token1: any,
  fee: any = FeeAmount.LOW,
) => {
  const tickLower = -887000;
  const tickUpper = 887000;

  const poolAddress = Pool.getAddress(token0, token1, fee);
  let poolData = await wc.pool.getPoolData(poolAddress);

  const pool = new Pool(
    token0,
    token1,
    fee,
    poolData.slot0[0].toString(),
    0,
    poolData.slot0[1],
    []
  );
  const liquidityPosition = new Position({
    pool: pool,
    liquidity: liquidity,
    tickLower: tickLower,
    tickUpper: tickUpper,
  });

  const tokenAmounts = liquidityPosition.mintAmounts;

  // Return the calculated values
  return tokenAmounts;
};

export default uniswapCalculator;
