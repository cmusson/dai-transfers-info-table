"use client";
import { BigNumber } from "bignumber.js";

interface ITransfer {
  blockNumber: number;
  amount: number;
  sender: string;
  recipient: string;
  transactionHash: string;
}

interface ITableProps {
  transfers: ITransfer[];
}

const trimAddress = (address: string): string => {
  const leftSide = address.slice(0, 4);

  const rightSide = address.slice(-4);

  return leftSide + "..." + rightSide;
};

const stringifiedNumberToMonetaryString = (amount: string): string => {
  let [pre, post] = amount.split(".");

  let newPre = "";
  while (pre.length > 3) {
    newPre = "," + pre.slice(pre.length - 3) + newPre;
    pre = pre.slice(0, pre.length - 3);
  }

  newPre = pre + newPre;

  let newPost = post === "00" ? "" : post;

  return newPost ? newPre + "." + post : newPre;
};

export default function Table({ transfers }: ITableProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="flex gap-2">
        <input className="w-48" placeholder="Filter 100 by address..."></input>
        <button className=" border border-white-200 px-1">Filter</button>
        <button className=" border border-white-200 px-1">Reset</button>
      </div>

      <div className="flex gap-2">
        <button className=" border border-white-200 px-1">Sender</button>
        <button className=" border border-white-200 px-1">Receiver</button>
      </div>

      <div className="flex justify-between px-4">
        <div
          className="w-40 border border-white-200 px-1"
          onClick={() => {
            transfers.sort();
          }}
        >
          Amount
        </div>
        <div className="w-40 border border-white-200 px-1">Sender</div>
        <div className="w-40 border border-white-200 px-1">Recipient</div>
        <div className="w-40 border border-white-200 px-1">
          Transaction Hash
        </div>
        <div
          className="w-40 border border-white-200 px-1"
          onClick={() => {
            transfers.sort();
          }}
        >
          Timestamp
        </div>
      </div>
      {transfers.map((transfer: ITransfer, i: number) => (
        <div
          className="flex flex-row px-4 justify-between"
          key={`${i}-${transfer.transactionHash}`}
        >
          <div className="w-40 px-1">{`$${stringifiedNumberToMonetaryString(
            new BigNumber(transfer.amount).div(10 ** 18).toFixed(2)
          )}`}</div>
          <div className="w-40 px-1" title={transfer.sender}>
            {trimAddress(transfer.sender)}
          </div>
          <div className="w-40 px-1" title={transfer.recipient}>
            {trimAddress(transfer.recipient)}
          </div>
          <div className="w-40 px-1" title={transfer.transactionHash}>
            {trimAddress(transfer.transactionHash)}
          </div>
          <div className="w-40 px-1">{transfer.blockNumber}</div>
        </div>
      ))}
    </main>
  );
}
