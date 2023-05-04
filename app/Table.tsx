"use client";
import { BigNumber } from "bignumber.js";
import { useEffect, useState } from "react";
import Image from "next/image";
import AddressCell from "./AddressCell";
import { sortFunc, stringifiedNumberToMonetaryString } from "./util/functions";
import Web3 from "web3";
import { ITransfer } from "./util/definitions/interfaces";
import { fetchPastAddressTransfers } from "./api/getTransfers/fetchPastAddressTransfers";
import { AbiItem } from "web3-utils";
import abi from "./lib/daiAbi.json";
import InputAndSearch from "./InputAndSearch";

interface ITableProps {
  transfers: ITransfer[];
}
const infuraApi = process.env.INFURA_API_KEY;
const infuraWebSocketUrl = `wss://mainnet.infura.io/ws/v3/${infuraApi}`;

export default function Table({ transfers }: ITableProps) {
  const [transFs, setTransFs] = useState(transfers);
  const [filterInput, setFilterInput] = useState("");
  const [sortedByTime, setSortedByTime] = useState(true);
  const [sortedByTimeRecent, setSortedByTimeRecent] = useState(true);
  const [sortedByAmount, setSortedByAmount] = useState(false);
  const [filteredSortedByTime, setFilteredSortedByTime] = useState(true);
  const [filteredSortedByTimeRecent, setFilteredSortedByTimeRecent] =
    useState(true);
  const [filteredSortedByAmount, setFilteredSortedByAmount] = useState(false);
  const [filteredTransfers, setFilteredTransfers] =
    useState<ITransfer[]>(transfers);
  const [original, setOriginal] = useState(true);
  const [type, setType] = useState<"sender" | "recipient" | null>(null);
  const [clickCount, setClickCount] = useState(0);

  // Trigger api to display last 100 of specified address
  useEffect(() => {
    if (!filterInput || !type) return;

    let isSubscribed = true;

    const fetchLast100Address = async () => {
      const pastTransfers = await fetchPastAddressTransfers(filterInput, type);
      if (isSubscribed) {
        setFilteredTransfers(pastTransfers);
      }

      return () => {
        isSubscribed = false;
      };
    };

    fetchLast100Address();
  }, [clickCount]);

  // fetch last 100 of dai contract
  useEffect(() => {
    const fetchAndSubscribe = async () => {
      // Create a new web3 instance and set the provider to Infura's WebSocket endpoint
      const web3Socket = new Web3(
        new Web3.providers.WebsocketProvider(infuraWebSocketUrl)
      );

      // Instantiate the DAI contract
      const daiContract = new web3Socket.eth.Contract(
        abi as AbiItem[],
        "0x6b175474e89094c44da98b954eedeac495271d0f"
      );

      // Set the filter for incoming or outgoing transfers
      const filter =
        type === "sender" ? { from: filterInput } : { to: filterInput };

      // Subscribe to the Transfer events and update transfers or Transfers and Filtered
      daiContract.events
        .Transfer({ filter: filter })
        .on("data", (event: any) => {
          const { returnValues } = event;

          const transactionHash = event.transactionHash;
          const timestamp = Math.floor(Date.now() / 1000).toString();
          const amount = returnValues.wad as number;
          const sender = returnValues.src as string;
          const recipient = returnValues.dst as string;
          const time = new Date().toLocaleDateString("en-US", {
            day: "numeric",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });

          const newListItem: ITransfer = {
            transactionHash,
            timestamp,
            amount,
            sender,
            recipient,
            time,
          };

          if (type !== null) {
            if (newListItem[type] == filterInput) {
              setFilteredTransfers((prevTransfers: ITransfer[]) => [
                newListItem,
                ...prevTransfers.slice(0, 99),
              ]);
            }
          }
          // MAKE SURE TX HASH DOESNT ALREADY EXIST THEN ADD

          const isDuplicate = transfers.some(
            (existingTransfer) =>
              existingTransfer.transactionHash === newListItem.transactionHash
          );

          if (!isDuplicate) {
            setTransFs((prevTransfers: ITransfer[]) => [
              newListItem,
              ...prevTransfers.slice(0, 99),
            ]);
          }
        })
        .on("error", (error: Error) => {
          console.error("Error in the Transfer event subscription:", error);
        });

      return () => {
        if (
          web3Socket.currentProvider &&
          (web3Socket.currentProvider as any).disconnect
        ) {
          (web3Socket.currentProvider as any).disconnect();
        }
      };
    };

    fetchAndSubscribe();
  }, []);

  // reset list to last 100
  const resetFunc = () => {
    setOriginal(true);
    setFilterInput("");
  };

  // switch between the two lists
  const filterFunc = (type: "sender" | "recipient") => {
    setClickCount((prevCount) => prevCount + 1);
    setType(type);
    setOriginal(false);
  };

  // set sort arrows for all
  const upArrowAmount =
    !sortedByTime && !sortedByAmount ? "/upIconActive.svg" : "/upIcon.svg";
  const downArrowAmount =
    !sortedByTime && sortedByAmount ? "/downIconActive.svg" : "/downIcon.svg";
  const upArrowTime =
    sortedByTime && sortedByTimeRecent ? "/upIconActive.svg" : "/upIcon.svg";
  const downArrowTime =
    sortedByTime && !sortedByTimeRecent
      ? "/downIconActive.svg"
      : "/downIcon.svg";

  //set sort arrows for filter
  const filteredUpArrowAmount =
    !filteredSortedByTime && !filteredSortedByAmount
      ? "/upIconActive.svg"
      : "/upIcon.svg";
  const filteredDownArrowAmount =
    !filteredSortedByTime && filteredSortedByAmount
      ? "/downIconActive.svg"
      : "/downIcon.svg";
  const filteredUpArrowTime =
    filteredSortedByTime && filteredSortedByTimeRecent
      ? "/upIconActive.svg"
      : "/upIcon.svg";
  const filteredDownArrowTime =
    filteredSortedByTime && !filteredSortedByTimeRecent
      ? "/downIconActive.svg"
      : "/downIcon.svg";

  const arrowSortFunc = (type: "timeHL" | "timeLH" | "amountHL" | "amountLH") =>
    original
      ? sortFunc(
          type,
          transFs,
          setTransFs,
          setSortedByTime,
          setSortedByTimeRecent,
          setSortedByAmount
        )
      : sortFunc(
          type,
          filteredTransfers,
          setFilteredTransfers,
          setFilteredSortedByTime,
          setFilteredSortedByTimeRecent,
          setFilteredSortedByAmount
        );

  return (
    <main className="flex min-h-screen flex-col items-center gap-1">
      <div className="flex flex-col items-center gap-2 sticky top-20 left-0 right-0 z-10 bg-prpl-dark pt-1">
        <h1>Last 100 Dai Transfers</h1>
        <InputAndSearch
          filterInput={filterInput}
          setFilterInput={setFilterInput}
          filterFunc={filterFunc}
          resetFunc={resetFunc}
        />

        <h2 className="text-xs w-full text-center">
          Enter a valid wallet address and select filter by sender or recipient
          to show up to the last 100 transactions
        </h2>

        <div className="flex justify-between px-4 py-2 bg-prpl-lightest">
          <div className="flex justify-start w-20 tablet:w-40 text-xs tablet:text-base px-1">
            <div className="flex gap-2 align-center w-20 tablet:w-40 text-xs tablet:text-base px-1">
              <h3>Amount</h3>
              <div className="flex flex-col ">
                <Image
                  src={original ? upArrowAmount : filteredUpArrowAmount}
                  className="cursor-pointer hover:opacity-50"
                  alt=""
                  width={13}
                  height={13}
                  onClick={() => arrowSortFunc("amountLH")}
                />
                <Image
                  src={original ? downArrowAmount : filteredDownArrowAmount}
                  className="cursor-pointer hover:opacity-50"
                  alt=""
                  width={13}
                  height={13}
                  onClick={() => arrowSortFunc("amountHL")}
                />
              </div>
            </div>
          </div>
          <h3 className="w-20 tablet:w-40 text-xs tablet:text-base px-1">
            Sender
          </h3>
          <div className="w-20 tablet:w-40 text-xs tablet:text-base px-1">
            Recipient
          </div>
          <h3 className="w-20 tablet:w-40 text-xs tablet:text-base px-1">
            Etherscan
          </h3>
          <div className="flex gap-2 align-center w-20 tablet:w-40 text-xs tablet:text-base px-1">
            <h3>Timestamp</h3>
            <div className="flex flex-col">
              <Image
                src={original ? upArrowTime : filteredUpArrowTime}
                className="cursor-pointer hover:opacity-50"
                alt=""
                width={13}
                height={13}
                onClick={() => arrowSortFunc("timeLH")}
              />
              <Image
                src={original ? downArrowTime : filteredDownArrowTime}
                className="cursor-pointer hover:opacity-50"
                alt=""
                width={13}
                height={13}
                onClick={() => arrowSortFunc("timeHL")}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-between bg-prpl-light">
        {/* maps the rows for filtered or the original data for the table  */}
        {(original ? transFs : filteredTransfers).map(
          (transfer: ITransfer, i: number) => (
            <div
              className={`flex flex-row px-4 justify-between border border-transparent hover:border-white  ${
                i % 2 ? "bg-prpl-row" : "bg-prpl-light"
              }`}
              key={`${i}-${transfer.transactionHash}`}
            >
              <div className="w-20 tablet:w-40 px-1 py-2 text-xs tablet:text-base flex flex-col justify-end tablet:justify-start">
                <p>
                  {`$${stringifiedNumberToMonetaryString(
                    new BigNumber(transfer.amount).div(10 ** 18).toFixed(2)
                  )}`}
                </p>
              </div>
              <AddressCell transfer={transfer} type="sender" />
              <AddressCell transfer={transfer} type="recipient" />
              <AddressCell transfer={transfer} type="transactionHash" />

              <div className="w-20 tablet:w-40 px-1 py-2 text-xs tablet:text-base flex flex-col justify-end tablet:justify-start">
                <p>{transfer.time}</p>
              </div>
            </div>
          )
        )}
      </div>
    </main>
  );
}
