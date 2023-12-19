
import { useWalletContext } from "@contexts/WalletContext";

export default function CreateResource() {
  const wc = useWalletContext();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const data = new FormData(event.target);
    
    const tx: any = await wc.addResource(
      data.get("metadata")
    );
    console.log(tx);
  };
  return (
    <form onSubmit={handleSubmit}>
      <h1>Create Resource</h1>
      <fieldset className="rounded-lg border border-dark-1500 p-4">
        <textarea
          id="metadata"
          name="metadata"
          className="inputText"
          defaultValue={`{"thing":"thong"}`}
        />
        <br />
        <button type="submit" className="btn">
          Create Resource
        </button>
      </fieldset>
    </form>
  );
}
