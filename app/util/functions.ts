"use client";
import { Dispatch, SetStateAction } from "react";
import { ITransfer } from "./definitions/interfaces";

export const trimAddress = (address: string): string => {
  const leftSide = address.slice(0, 4);
  const rightSide = address.slice(-4);
  return leftSide + "..." + rightSide;
};

export const copyAddress = (
  address: string,
  setIcon: Dispatch<SetStateAction<string>>
) => {
  // Copies to clipboard
  navigator.clipboard.writeText(address);
  setIcon("/copiedIcon.svg");

  setTimeout(() => {
    setIcon("/copyIcon.svg");
  }, 1000);
};

const openInNewTab = (txHash: string): void => {
  const newWindow = window.open(
    `https://etherscan.io/tx/${txHash}`,
    "_blank",
    "noopener,noreferrer"
  );
  if (newWindow) newWindow.opener = null;
};

export const onClickUrl =
  (url: string): (() => void) =>
  () =>
    openInNewTab(url);

export const stringifiedNumberToMonetaryString = (amount: string): string => {
  let [pre, post] = amount.split(".");
  let newPre = "";
  while (pre.length > 3) {
    newPre = "," + pre.slice(pre.length - 3) + newPre;
    pre = pre.slice(0, pre.length - 3);
  }
  newPre = pre + newPre;
  return post ? newPre + "." + post : newPre;
};

export const validateWalletAddress = (address: string): boolean => {
  const pattern = /^(0x)?[0-9a-fA-F]{40}$/; // Ethereum address pattern
  return pattern.test(address);
};
