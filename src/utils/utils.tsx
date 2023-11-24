export function getShortName(str:string, dots = false, perSide = 3) {
  let len = str.length / 2;
  return (
    str.slice(0, perSide) + //first 3 chars
    (dots ? "..." : str.slice(len - 1, len + 1)) + //middle two chars
    str.slice(-perSide)
  ) // last 3 chars
    .toLowerCase();
}