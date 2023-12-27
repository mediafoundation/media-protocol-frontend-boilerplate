import { useWalletContext } from "@contexts/WalletContext";
import { PiSmileySadDuotone } from "react-icons/pi";
import { FaCheckCircle } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";

export default function Deals({ items }: any) {

  const wc = useWalletContext();
  
  return (
    <div className='my-6'>
      {items.length > 0 ? items.map((deal:any, i:number) => (
        <div className='flex items-start gap-3 border-t border-t-dark-1500 mt-2 pt-2' key={i}>
          <div>
            { deal.status.cancelled == false ? (
              <FaCheckCircle className="text-green-500" />
            ) : (
              <FaCircleXmark className="text-red-500"/>
            )}
          </div>
          <ul>
            {Object.entries(deal).map(([key, value]) => (
              <li key={key}>
                {key}: {JSON.stringify(value)}
              </li>
            ))}
          </ul>
          { deal.status.cancelled == false && (
          <button 
            onClick={() => wc.cancelDeal(deal.id)}
            className="btn">Cancel Deal
          </button>
          )}
        </div>
      )) : (
        <div className='flex gap-2 items-center'>
          <PiSmileySadDuotone className='text-2xl' /> No deals found
        </div>
      )}
    </div>
  )
}