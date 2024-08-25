import { useRef } from "react"
import { useWalletContext } from "@contexts/WalletContext"
import LoadingButton from "./LoadingButton"

export default function CreateResource() {
  const wc = useWalletContext()
  const formRef = useRef<HTMLFormElement>(null) // Create a ref for the form

  const handleSubmit = async () => {
    const form = formRef.current;
    if (!form) return;

    const data = new FormData(form)

    await wc.addResource(data.get("metadata"))
  }
  return (
    <form ref={formRef}>
      <h1>Create Resource</h1>
      <fieldset className="rounded-lg border border-dark-1500 p-4">
        <textarea
          id="metadata"
          name="metadata"
          className="inputText w-full md:w-2/3 xl:1/2"
          defaultValue={`{"thing":"thong"}`}
        />
        <br />
        {!wc.encryptionPublicKey ? (
          <LoadingButton 
            type="submit" 
            className="btn" 
            onClick={async(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              await wc.getEncryptionPublicKey();
            }}
          >
            #1 - Get Encryption Key
          </LoadingButton>
        ) : (
          <LoadingButton 
            type="submit" 
            className="btn" 
            onClick={async(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              await handleSubmit();
            }}
          >
            Create Resource
          </LoadingButton>
        )}

      </fieldset>
    </form>
  )
}
