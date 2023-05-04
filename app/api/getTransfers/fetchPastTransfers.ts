import { ITransfer } from "@/app/util/definitions/interfaces";

export async function fetchPastTransfers(): Promise<ITransfer[]> {
  const response = await fetch(
    "https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=0x6b175474e89094c44da98b954eedeac495271d0f&page=1&offset=100&sort=desc&apikey=NB64ZPT1ZABJHCRRG1CAGPZ4MWGIPYZM33",
    { cache: "no-cache" }
  );

  const { result } = await response.json();

  const transfers: ITransfer[] = result.map((tx: any) => {
    const transactionHash = tx.hash;
    const timestamp = parseInt(tx.timeStamp, 10).toString();
    const amount = tx.value;
    const sender = tx.from;
    const recipient = tx.to;
    const time = new Date(parseInt(tx.timeStamp, 10) * 1000).toLocaleDateString(
      "en-US",
      {
        day: "numeric",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }
    );

    return { transactionHash, timestamp, amount, sender, recipient, time };
  });

  return transfers;
}
