"use client";
import { BigNumber } from "bignumber.js";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AddressCell from "./AddressCell";
import { stringifiedNumberToMonetaryString } from "./util/functions";
import Web3 from "web3";
import { ITransfer } from "./util/definitions/interfaces";
import { AbiItem } from "web3-utils";
import abi from "./lib/daiAbi.json";
import InputAndSearch from "./InputAndSearch";
import {
  setTransFs,
  setType,
  setOriginal,
  selectFilteredTransfers,
  selectOriginal,
  selectType,
  addTransferToFiltered,
  addTransfer,
  fetchPastTransfers,
} from "./GlobalRedux/tableSlice";
import { ActionCreatorWithPayload, unwrapResult } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "./GlobalRedux/store";
import TableHeaders from "./TableHeaders";

const infuraApi = process.env.NEXT_PUBLIC_INFURA_API_KEY;
const infuraWebSocketUrl = `wss://mainnet.infura.io/ws/v3/${infuraApi}`;

interface ITableProps {
  transfers: ITransfer[];
}

export default function Table({ transfers }: ITableProps) {
  const dispatch: AppDispatch = useDispatch();
  const transFs = useSelector((state: RootState) => state.table.transFs);
  const filteredTransfers = useSelector(selectFilteredTransfers);
  const original = useSelector(selectOriginal);
  const type = useSelector(selectType);
  const [filterInput, setFilterInput] = useState("");
  const [clickCount, setClickCount] = useState(0);
  const [initial, setInitial] = useState(true);

  // Trigger api to display last 100 of specified address
  useEffect(() => {
    if (!filterInput || !type) return;

    let isSubscribed = true;

    const fetchLast100Address = async () => {
      try {
        const resultAction = await dispatch(
          fetchPastTransfers({ filterInput, type })
        );
        if (isSubscribed) {
          unwrapResult(resultAction);
        }
      } catch (err) {
        console.error("Failed to fetch past transfers: ", err);
      }

      return () => {
        isSubscribed = false;
      };
    };

    fetchLast100Address();
  }, [clickCount]);

  // listen to new transfer events
  useEffect(() => {
    dispatch(setTransFs(transfers));
    setInitial(false);
    const fetchAndSubscribe = async () => {
      const web3Socket = new Web3(
        new Web3.providers.WebsocketProvider(infuraWebSocketUrl)
      );

      const daiContract = new web3Socket.eth.Contract(
        abi as AbiItem[],
        "0x6b175474e89094c44da98b954eedeac495271d0f"
      );

      // Subscribe to Transfer events
      daiContract.events
        .Transfer({})
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

          // Check if the new transfer is relevant for the current filteredTransfers list
          if (type !== null && newListItem[type] === filterInput) {
            const isDuplicateFiltered = filteredTransfers.some(
              (existingTransfer) =>
                existingTransfer.transactionHash === newListItem.transactionHash
            );

            if (!isDuplicateFiltered) {
              dispatch(addTransferToFiltered(newListItem));
            }
          }

          // Make sure tx hash doesn't exist then add to main list
          const isDuplicate = transFs.some(
            (existingTransfer) =>
              existingTransfer.transactionHash === newListItem.transactionHash
          );

          if (!isDuplicate) {
            dispatch(addTransfer(newListItem));
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
    dispatch(setOriginal(true));
    setFilterInput("");
  };

  // switch between the two lists
  const filterFunc = (type: "sender" | "recipient") => {
    setClickCount((prevCount) => prevCount + 1);
    dispatch(setType(type));
    dispatch(setOriginal(false));
  };

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

        <TableHeaders />
      </div>
      <div className="flex flex-col items-center justify-between bg-prpl-light">
        {/* maps the rows for filtered or the original data for the table  */}
        {(initial ? transfers : original ? transFs : filteredTransfers).map(
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
