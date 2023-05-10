import Table from "./Table";
import Image from "next/image";
import { fetchPastTransfers } from "./api/getTransfers/fetchPastTransfers";

export default async function Home() {
  const transfers = await fetchPastTransfers();
  return (
    <main className="flex min-h-screen flex-col items-center  ">
      <header className="flex justify-center tablet:justify-start pl-2 h-20 sticky top-0 left-0 right-0 z-10 w-full select-none border-b-2 border-solid border-prpl-row bg-black/[0.6] backdrop-blur">
        <Image src={"/Tessera.svg"} alt={"Logo"} width={128} height={25} />
      </header>

      <Table transfers={transfers} />
    </main>
  );
}
