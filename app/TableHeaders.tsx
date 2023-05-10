"use client";

import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  selectFilteredSortedByAmount,
  selectFilteredSortedByTime,
  selectFilteredSortedByTimeRecent,
  selectOriginal,
  selectSortedByAmount,
  selectSortedByTime,
  selectSortedByTimeRecent,
  setFilteredSortedByAmount,
  setFilteredSortedByTime,
  setFilteredSortedByTimeRecent,
  setSortedByAmount,
  setSortedByTime,
  setSortedByTimeRecent,
  sortFilteredTransfersHighToLow,
  sortFilteredTransfersHighToLowTime,
  sortFilteredTransfersLowToHigh,
  sortFilteredTransfersLowToHighTime,
  sortTransFsHighToLow,
  sortTransFsHighToLowTime,
  sortTransFsLowToHigh,
  sortTransFsLowToHighTime,
} from "./GlobalRedux/tableSlice";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";

export default function TableHeaders() {
  const dispatch = useDispatch();
  const original = useSelector(selectOriginal);
  const sortedByTime = useSelector(selectSortedByTime);
  const sortedByTimeRecent = useSelector(selectSortedByTimeRecent);
  const sortedByAmount = useSelector(selectSortedByAmount);
  const filteredSortedByTime = useSelector(selectFilteredSortedByTime);
  const filteredSortedByTimeRecent = useSelector(
    selectFilteredSortedByTimeRecent
  );
  const filteredSortedByAmount = useSelector(selectFilteredSortedByAmount);

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

  // Define which arrow is highlighted to represent current sort
  const arrowSortFunc = (
    type: "timeHL" | "timeLH" | "amountHL" | "amountLH"
  ) => {
    const sortFunctionsMap: Record<string, any> = {
      original: {
        timeLH: sortTransFsLowToHighTime(),
        timeHL: sortTransFsHighToLowTime(),
        amountLH: sortTransFsLowToHigh(),
        amountHL: sortTransFsHighToLow(),
      },
      filtered: {
        timeLH: sortFilteredTransfersLowToHighTime(),
        timeHL: sortFilteredTransfersHighToLowTime(),
        amountLH: sortFilteredTransfersLowToHigh(),
        amountHL: sortFilteredTransfersHighToLow(),
      },
    };

    const sortFunction = original
      ? sortFunctionsMap.original[type]
      : sortFunctionsMap.filtered[type];

    const setTime = original ? setSortedByTime : setFilteredSortedByTime;
    const setTimeRecent = original
      ? setSortedByTimeRecent
      : setFilteredSortedByTimeRecent;
    const setAmount = original ? setSortedByAmount : setFilteredSortedByAmount;

    sortFunc(type, sortFunction, setTime, setTimeRecent, setAmount);
  };

  // Sort the list based on user action
  const sortFunc = (
    sort: "timeHL" | "timeLH" | "amountHL" | "amountLH",
    setList: any,
    setSortedTime: ActionCreatorWithPayload<boolean>,
    setSortedTimeRecent: ActionCreatorWithPayload<boolean>,
    setSortedAmount: ActionCreatorWithPayload<boolean>
  ) => {
    dispatch(setList);
    dispatch(setSortedTime(sort === "timeLH" || sort === "timeHL"));
    dispatch(setSortedTimeRecent(sort === "timeLH"));
    dispatch(setSortedAmount(sort === "amountHL"));
  };

  return (
    <div className="flex justify-between px-4 py-2 bg-prpl-lightest">
      <div className="flex justify-start w-20 tablet:w-40 text-xs tablet:text-base px-1">
        <div className="flex gap-2 align-center w-20 tablet:w-40 text-xs tablet:text-base px-1">
          <h3>Amount</h3>
          <div className="flex flex-col ">
            <Image
              src={original ? upArrowAmount : filteredUpArrowAmount}
              className="cursor-pointer hover:opacity-50"
              alt="arrow up"
              width={13}
              height={13}
              onClick={() => arrowSortFunc("amountLH")}
            />
            <Image
              src={original ? downArrowAmount : filteredDownArrowAmount}
              className="cursor-pointer hover:opacity-50"
              alt="arrow down"
              width={13}
              height={13}
              onClick={() => arrowSortFunc("amountHL")}
            />
          </div>
        </div>
      </div>
      <h3 className="w-20 tablet:w-40 text-xs tablet:text-base px-1">Sender</h3>
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
            alt="arrow up"
            width={13}
            height={13}
            onClick={() => arrowSortFunc("timeLH")}
          />
          <Image
            src={original ? downArrowTime : filteredDownArrowTime}
            className="cursor-pointer hover:opacity-50"
            alt="arrow down"
            width={13}
            height={13}
            onClick={() => arrowSortFunc("timeHL")}
          />
        </div>
      </div>
    </div>
  );
}
