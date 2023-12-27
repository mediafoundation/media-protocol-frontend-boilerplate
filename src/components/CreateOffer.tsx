import { useWalletContext } from "@contexts/WalletContext"

export default function CreateOffer() {
  const wc = useWalletContext()

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    const data = new FormData(event.target)

    const tx: any = await wc.createOffer(
      data.get("maximumDeals"),
      data.get("autoAccept") === "on" ? true : false,
      data.get("pricePerSecond"),
      data.get("minDealDuration"),
      data.get("billFullPeriods") === "on" ? true : false,
      data.get("singlePeriodOnly") === "on" ? true : false,
      data.get("metadata")
    )
    console.log(tx)
  }
  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="rounded-lg border border-dark-1500 p-4 mb-4 [&_>div]:flex [&_>div]:gap-3 [&_>div]:items-center [&_>div]:min-h-[3rem] [&_>div>label]:block [&_>div>label]:min-w-[10rem]">
        <div>
          <label htmlFor="maximumDeals">Maximum Deals</label>
          <input
            id="maximumDeals"
            name="maximumDeals"
            type="text"
            className="inputText"
            defaultValue={"100"}
          />
        </div>
        <div>
          <label htmlFor="autoAccept">Auto Accept</label>
          <input
            id="autoAccept"
            name="autoAccept"
            type="checkbox"
            defaultChecked={true}
          />
        </div>
        <div>
          <label htmlFor="pricePerSecond">Price Per Second</label>
          <input
            id="pricePerSecond"
            name="pricePerSecond"
            type="text"
            className="inputText"
            defaultValue={"100"}
          />
        </div>
        <div>
          <label htmlFor="minDealDuration">Min Deal Duration</label>
          <input
            id="minDealDuration"
            name="minDealDuration"
            type="text"
            className="inputText"
            defaultValue={"15"}
          />
        </div>
        <div>
          <label htmlFor="billFullPeriods">Bill Full Periods</label>
          <input id="billFullPeriods" name="billFullPeriods" type="checkbox" />
        </div>
        <div>
          <label htmlFor="singlePeriodOnly">Single Period Only</label>
          <input
            id="singlePeriodOnly"
            name="singlePeriodOnly"
            type="checkbox"
          />
        </div>
        <div>
          <label htmlFor="metadata">Metadata</label>
          <input
            id="metadata"
            name="metadata"
            type="text"
            className="inputText"
            defaultValue={`{"thing":"thong"}`}
          />
        </div>
        <div className="border-t border-dark-1500 mt-5 pt-5">
          <button type="submit" className="btn">
            Create Offer
          </button>
        </div>
      </fieldset>
    </form>
  )
}
