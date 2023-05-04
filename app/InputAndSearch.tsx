"use client";
import Image from "next/image";
import Button from "./Button";
import { validateWalletAddress } from "./util/functions";
import { Dispatch, SetStateAction } from "react";

interface IInputAndSearchProps {
  filterInput: string;
  setFilterInput: Dispatch<SetStateAction<string>>;
  filterFunc: (type: "sender" | "recipient") => void;
  resetFunc: () => void;
}

export default function InputAndSearch({
  filterInput,
  setFilterInput,
  filterFunc,
  resetFunc,
}: IInputAndSearchProps) {
  return (
    <div className="flex items-center gap-2 m-1 flex-col tablet:flex-row">
      <div className="relative ">
        <input
          spellCheck="false"
          className="w-96 text-prpl-dark pl-1 pr-6 hover:text-red"
          placeholder="Enter address to filter..."
          onChange={(text: React.FormEvent<HTMLInputElement>) => {
            setFilterInput(text.currentTarget.value);
          }}
          value={filterInput}
        />
        {filterInput === "" ? (
          <></>
        ) : (
          <Image
            src="/x.svg"
            alt=""
            width={20}
            height={20}
            className="absolute top-0.5 right-0.5 cursor-pointer hover:opacity-50"
            onClick={() => setFilterInput("")}
          />
        )}
      </div>

      <div className="flex justify-center tablet:justify-start gap-2 m-1">
        <Button
          handleClick={() => filterFunc("sender")}
          type={"action"}
          disabled={!validateWalletAddress(filterInput)}
        >
          Filter by sender
        </Button>
        <Button
          handleClick={() => filterFunc("recipient")}
          type={"action"}
          disabled={!validateWalletAddress(filterInput)}
        >
          Filter by recipient
        </Button>
        <Button handleClick={() => resetFunc()} type={"reset"}>
          Reset
        </Button>
      </div>
    </div>
  );
}
