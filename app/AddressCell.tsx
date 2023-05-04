"use client";

import { useState } from "react";
import { copyAddress, onClickUrl, trimAddress } from "./util/functions";
import Image from "next/image";
import { ITransfer } from "./util/definitions/interfaces";

interface IRowProps {
  transfer: ITransfer;
  type: "sender" | "recipient" | "transactionHash";
}

export default function AddressCell({ transfer, type }: IRowProps) {
  const [icon, setIcon] = useState("/copyIcon.svg");
  return (
    <div
      className="w-20 tablet:w-40 px-1 py-2 flex flex-col justify-end tablet:flex-row items-center tablet:justify-start gap-2 text-xs tablet:text-base"
      onClick={() => copyAddress(transfer[type], setIcon)}
    >
      {type !== "transactionHash" ? (
        <div>
          <Image
            className="cursor-pointer hover:opacity-50"
            src={icon}
            alt=""
            width={17}
            height={17}
          />
        </div>
      ) : (
        <></>
      )}
      {type === "transactionHash" ? (
        <p
          className="hover:underline cursor-pointer text-xs tablet:text-base "
          onClick={onClickUrl(transfer.transactionHash)}
        >
          {transfer[type] && trimAddress(transfer[type])}
        </p>
      ) : (
        <p> {transfer[type] && trimAddress(transfer[type])}</p>
      )}
    </div>
  );
}
