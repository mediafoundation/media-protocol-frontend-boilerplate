import {
  Address,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi"
import { erc20ABI } from "@wagmi/core"
import { useEffect, useState } from "react"

export function useApproval(token: Address, spender: Address, amount: bigint) {
  const [finished, setFinished] = useState(false)

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: token,
    abi: erc20ABI,
    functionName: "approve",
    args: [spender, amount],
    enabled: amount > 0,
  })

  const { data, error, isError, isLoading, isSuccess, write, status } =
    useContractWrite(config)

  const {
    isLoading: isLoadingWaitForTransaction,
    isSuccess: isSuccessWaitForTransaction,
  } = useWaitForTransaction({
    hash: data?.hash,
    confirmations: 2,
  })

  useEffect(() => {
    if (isSuccessWaitForTransaction) {
      setFinished(true)
    }
  }, [isSuccessWaitForTransaction])

  return {
    approve: write,
    error,
    data,
    isError,
    isLoading,
    isSuccess,
    config,
    prepareError,
    isPrepareError,
    isLoadingWaitForTransaction,
    isSuccessWaitForTransaction,
    status,
    finished,
  }
}
