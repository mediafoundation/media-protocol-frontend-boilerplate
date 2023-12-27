import { useState } from "react";
import { Loader } from "./Loader";

export default function LoadingButton(props: any) {

  const [isLoading, setIsLoading] = useState(false);
  const { children, onClick, ...rest } = props;

  return (
    <button {...rest}
      onClick={async (event) => {
        setIsLoading(true);
        await props.onClick(event);
        setIsLoading(false);
      }}   
    >
      {isLoading ? <Loader /> : children}
    </button>
  );
}