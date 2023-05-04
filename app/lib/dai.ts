import Web3 from "web3";
import { AbiItem } from "web3-utils";
import abi from "./daiAbi.json";

const infuraApi = "0e29589be8ee406fbdd8ff9cd65788e2";
const infuraUrl = `https://mainnet.infura.io/v3/${infuraApi}`;
const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));

const daiAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";

export const daiContract = new web3.eth.Contract(abi as AbiItem[], daiAddress);
