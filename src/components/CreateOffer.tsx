
import { useWalletContext } from "@contexts/WalletContext";

export default function CreateOffer() {
  const wc = useWalletContext();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const data = new FormData(event.target);
    
    const tx: any = await wc.createOffer(
      data.get("maximumDeals"),
      data.get("autoAccept") === "on" ? true : false,
      data.get("pricePerSecond"),
      data.get("minDealDuration"),
      data.get("billFullPeriods") === "on" ? true : false,
      data.get("singlePeriodOnly") === "on" ? true : false,
      data.get("metadata")
    );
    console.log(tx);
  };
  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="rounded-lg border border-dark-1500 p-4">
        <label htmlFor="maximumDeals">Maximum Deals</label>
        <input
          id="maximumDeals"
          name="maximumDeals"
          type="text"
          className="inputText"
          defaultValue={"100"}
        />
        <br />
        <label htmlFor="autoAccept">Auto Accept</label>
        <input
          id="autoAccept"
          name="autoAccept"
          type="checkbox"
          defaultChecked={true}
        />
        <br />
        <label htmlFor="pricePerSecond">Price Per Second</label>
        <input
          id="pricePerSecond"
          name="pricePerSecond"
          type="text"
          className="inputText"
          defaultValue={"100"}
        />
        <br />
        <label htmlFor="minDealDuration">Min Deal Duration</label>
        <input
          id="minDealDuration"
          name="minDealDuration"
          type="text"
          className="inputText"
          defaultValue={"15"}
        />
        <br />
        <label htmlFor="billFullPeriods">Bill Full Periods</label>
        <input id="billFullPeriods" name="billFullPeriods" type="checkbox" />
        <br />
        <label htmlFor="singlePeriodOnly">Single Period Only</label>
        <input id="singlePeriodOnly" name="singlePeriodOnly" type="checkbox" />
        <br />
        <label htmlFor="metadata">Metadata</label>
        <input
          id="metadata"
          name="metadata"
          type="text"
          className="inputText"
          defaultValue={`{"thing":"thong"}`}
        />
        <br />
        <button type="submit" className="btn">
          Create Offer
        </button>
      </fieldset>
    </form>
  );
}
