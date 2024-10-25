import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useWalletContext } from "@contexts/WalletContext";
import LoadingButton from "@components/LoadingButton";
import { useRef } from "react";
import { toast } from "sonner";
import { sanitizeError, tryExecute } from "@utils/utils";
import { Loader } from "@components/Loader";
import { PiProhibitDuotone } from "react-icons/pi";

export function getStaticProps() {
  return {
    props: {
      title: "Media Protocol Front-End Example",
      isIndex: true,
    },
  };
}

const Home: NextPage = () => {
  const { isConnected, address } = useAccount();
  const wc = useWalletContext();
  const formRefs = {
    requiredStake: useRef<HTMLFormElement>(null),
    marketFeeRate: useRef<HTMLFormElement>(null),
    marketFeeTo: useRef<HTMLFormElement>(null),
    marketMetadata: useRef<HTMLFormElement>(null),
  };

  const handleChange = (event: any) => {
    const result = event.target.value.replace(/\D/g, "");
    wc.setMarketplaceId(BigInt(result));
  };

  const executeWithForm = async (
    action: string,
    formName: keyof typeof formRefs
  ) => {
    const form = formRefs[formName].current;
    if (!form || !isConnected) return;
    const data = new FormData(form);

    try {
      await wc.marketplaceStorage.execute(action, [
        wc.marketplaceId,
        data.get(formName),
      ]);
    } catch (error) {
      toast.error(sanitizeError(error));
    }
  };

  const renderMarketplaceForm = (
    name: keyof typeof formRefs,
    action: string,
    value: any
  ) => (
    <form ref={formRefs[name]}>
      <input
        className="field mr-2"
        name={name}
        type="text"
        value={String(value)}
        onChange={(e) =>
          wc.setMarketplaceData({
            ...wc.marketplaceData,
            [name]:
              name === "requiredStake"
                ? BigInt(e.target.value)
                : e.target.value,
          })
        }
      />
      {isConnected && address === wc.marketplaceData.owner && (
        <LoadingButton
          type="submit"
          className="btn"
          onClick={async (event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            await executeWithForm(action, name);
          }}
        >
          Submit
        </LoadingButton>
      )}
    </form>
  );

  return (
    <>
      <h1>Media Protocol Front-End Example</h1>
      <p>
        This is a simple example of how to use the Media Protocol SDK in a
        Next.js app.
      </p>
      <hr className="border-dark-1500 mb-6" />
      <h1>Select a Marketplace</h1>
      <div className="flex gap-2 my-4">
        {isConnected && (
          <LoadingButton
            className="btn"
            onClick={async () => {
              await tryExecute(wc.initMarket);
            }}
          >
            Init New Marketplace
          </LoadingButton>
        )}
        <div className="flex gap-2 items-center">
          or choose ID
          <input
            className="inputText w-16"
            type="text"
            value={String(wc.marketplaceId)}
            onChange={handleChange}
          />
        </div>
      </div>
      {wc.marketplaceId && (
        <>
          <div className="mt-4 border border-dark-1500 rounded-xl p-6">
            {wc.marketplaceData ? (
              wc.marketplaceData.marketFeeRate != 0 ? (
                <>
                  <h1 className="pb-3 border-b border-dark-1500">
                    Marketplace Data
                  </h1>
                  <ul className="divide-y divide-dark-1500 [&_li]:py-3 ">
                    <li>Marketplace ID: {String(wc.marketplaceId)}</li>
                    <li>Deal Count: {String(wc.marketplaceData.dealCount)}</li>
                    <li>
                      Offer Count: {String(wc.marketplaceData.offerCount)}
                    </li>
                    <li>
                      Market Fee To:{" "}
                      {renderMarketplaceForm(
                        "marketFeeTo",
                        "setMarketFeeTo",
                        wc.marketplaceData.marketFeeTo
                      )}
                    </li>
                    <li>
                      Market Fee Rate:{" "}
                      <small>From 100 (0.01%) to 100000 (10%)</small>
                      {renderMarketplaceForm(
                        "marketFeeRate",
                        "setMarketFeeRate",
                        wc.marketplaceData.marketFeeRate
                      )}
                    </li>
                    <li>
                      Required Stake:{" "}
                      {renderMarketplaceForm(
                        "requiredStake",
                        "setRequiredStake",
                        wc.marketplaceData.requiredStake
                      )}
                    </li>
                    <li>
                      Market Metadata:{" "}
                      {renderMarketplaceForm(
                        "marketMetadata",
                        "setMarketMetadata",
                        wc.marketplaceData.marketMetadata
                      )}
                    </li>
                  </ul>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <PiProhibitDuotone className="text-xl" />{" "}
                  <span className="textMuted">Marketplace not found</span>
                </div>
              )
            ) : (
              <div className="flex items-center gap-2">
                <Loader />{" "}
                <span className="textMuted">Loading Marketplace Data</span>
              </div>
            )}
          </div>
          <hr className="border-dark-1500 my-6" />
          <div className="flex gap-2">
            <LoadingButton onClick={wc.getMarketplaceData} className="btn">
              Reload
            </LoadingButton>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
