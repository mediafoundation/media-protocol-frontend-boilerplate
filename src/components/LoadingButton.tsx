import { useState } from "react"
import { Loader } from "./Loader"

export default function LoadingButton(props: any) {
  const [isLoading, setIsLoading] = useState(false)
  const { children, onClick, ...rest } = props

  return (
    <button
      {...rest}
      onClick={async (event) => {
        setIsLoading(true)
        try{
          await props.onClick(event)
        } catch (error) {
          console.error(error)
        }
        setIsLoading(false)
      }}
    >
      {isLoading ? <><Loader /> {children}</> : children}
    </button>
  )
}
