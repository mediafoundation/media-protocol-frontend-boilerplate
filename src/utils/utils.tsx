export function getShortName(str: string, dots = false, perSide = 3) {
  let len = str.length / 2
  return (
    str.slice(0, perSide) + //first 3 chars
    (dots ? "..." : str.slice(len - 1, len + 1)) + //middle two chars
    str.slice(-perSide)
  ) // last 3 chars
    .toLowerCase()
}

export function sanitizeError(e: any) {
  console.error(e);
  if (!e) e = "Error: Unexpected error.";
  
  if (e.toString().toLowerCase().includes("has not been authorized by the user")) e = "Please check that your wallet is unlocked and connected to the correct network and account.";
  if (e.toString().toLowerCase().includes("user rejected")) e = "User rejected signature.";
  if (e.toString().toLowerCase().includes("user denied")) e = "User denied signature.";
  if (e.toString().toLowerCase().includes("insufficient funds")) e = "Insufficient funds.";
  if (e.toString().toLowerCase().includes("insufficient amount")) e = "Insufficient amount.";
  if (e.toString().toLowerCase().includes("reverted")) e = "Execution reverted.";

  if(e.message) e = e.message;

  return e;

}