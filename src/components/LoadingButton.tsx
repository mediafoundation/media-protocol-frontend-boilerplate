import { useState } from "react"
import { Loader } from "./Loader"

export default function LoadingButton(props: any) {
  const { loading, children, onClick, ...rest } = props
  const [isLoading, setIsLoading] = useState(loading)
  return (
    <button
      {...rest}
      onClick={onClick ? async (event) => {
        setIsLoading(true)
        try{
          await onClick(event)
        } catch (error) {
          console.error(error)
        }
        setIsLoading(false)
      } : undefined}
    >
      {isLoading ? <><Loader /> {children}</> : children}
    </button>
  )
}
