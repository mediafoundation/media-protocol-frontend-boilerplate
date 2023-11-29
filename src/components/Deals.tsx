import { useWalletContext } from "@contexts/WalletContext";
import { PiSmileySadDuotone } from "react-icons/pi";

export default function Deals({ items }: any) {

  const wc = useWalletContext();
  
  return (
    <div className='my-6'>
      {items.length > 0 ? items.map((deal:any, i:number) => (
        <div className='flex' key={i}>
          <textarea className="w-full" defaultValue={JSON.stringify(deal)} />
          <button 
            onClick={() => wc.cancelDeal(deal.id)}
            className="btn">Cancel Deal
          </button>
        </div>
      )) : (
        <div className='flex gap-2 items-center'>
          <PiSmileySadDuotone className='text-2xl' /> No deals found
        </div>
      )}
    </div>
  )
}