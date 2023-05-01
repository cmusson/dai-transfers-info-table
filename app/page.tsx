import Web3 from "web3";
import Table from "./Table";

interface ITransfer {
  blockNumber: number;
  amount: number;
  sender: string;
  recipient: string;
  transactionHash: string;
}

const infuraApi = "0e29589be8ee406fbdd8ff9cd65788e2";
const infuraUrl = `https://mainnet.infura.io/v3/${infuraApi}`;
const web3 = new Web3(infuraUrl);
const daiAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";
const ETHERSCAN_API_KEY = "NB64ZPT1ZABJHCRRG1CAGPZ4MWGIPYZM33";
const ETHERSCAN_API_URL = `https://api.etherscan.io/api?module=contract&action=getabi&address=0x6b175474e89094c44da98b954eedeac495271d0f&apikey=${ETHERSCAN_API_KEY}`;

const getTimestamp = async (blockNumber: string) => {
  const timestamp = (await web3.eth.getBlock(blockNumber)).timestamp.toString();
  return new Date(Number(timestamp) * 1000).toLocaleTimeString();
};

async function getTransfers() {
  const res = await fetch(ETHERSCAN_API_URL, { cache: "no-store" });
  const data = await res.json();
  const daiABI = JSON.parse(data.result);
  const daiContract = new web3.eth.Contract(daiABI, daiAddress);
  const blockNumber = await web3.eth.getBlockNumber();
  const fromBlock = Math.max(0, blockNumber - 200);
  const daiTransfers = await daiContract.getPastEvents(
    "Transfer",
    {
      fromBlock: fromBlock,
      toBlock: "latest",
    },
    (err) => {
      console.log(err);
    }
  );
  const dai100 = daiTransfers.slice(0, 100);
  // console.log("100 --->", dai100);
  // Map the transfer events to a new array of objects with the required data
  const transfers = dai100.map((event) => {
    return {
      blockNumber: event.blockNumber.toString(),
      amount: event.returnValues.wad as number,
      sender: event.returnValues.src as string,
      recipient: event.returnValues.dst as string,
      transactionHash: event.transactionHash,
    };
  });
  // console.log("TRANSFERS =====> ", transfers);
  // Return the array of transfers
  for (const tran of transfers) {
    // console.log(tran);
    const timestamp = await getTimestamp(tran.blockNumber);
    tran.blockNumber = `${timestamp}`;
  }
  return transfers as unknown as ITransfer[];
}

export default async function Home() {
  const transfers = await getTransfers();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Last 100 Dai Transfers</h1>
      <Table transfers={transfers} />
    </main>
  );
}
