"use client";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { ITransfer } from "../util/definitions/interfaces";
import { RootState } from "./store";
import { fetchPastAddressTransfers } from "../api/getTransfers/fetchPastAddressTransfers";

interface TableState {
  transFs: ITransfer[];
  sortedByTime: boolean;
  sortedByTimeRecent: boolean;
  sortedByAmount: boolean;
  filteredSortedByTime: boolean;
  filteredSortedByTimeRecent: boolean;
  filteredSortedByAmount: boolean;
  filteredTransfers: ITransfer[];
  original: boolean;
  type: "sender" | "recipient" | null;
}

const initialState: TableState = {
  transFs: [],
  sortedByTime: true,
  sortedByTimeRecent: true,
  sortedByAmount: false,
  filteredSortedByTime: true,
  filteredSortedByTimeRecent: true,
  filteredSortedByAmount: false,
  filteredTransfers: [],
  original: true,
  type: null,
};

// Create the async action creator
export const fetchPastTransfers = createAsyncThunk(
  "table/fetchPastTransfers",
  async (params: {
    filterInput: string;
    type: "sender" | "recipient" | null;
  }) => {
    const { filterInput, type } = params;
    if (!filterInput || !type) return;
    const pastTransfers = await fetchPastAddressTransfers(filterInput, type);
    return pastTransfers;
  }
);

export const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setTransFs: (state, action: PayloadAction<ITransfer[]>) => {
      state.transFs = action.payload;
    },

    setSortedByTime: (state, action: PayloadAction<boolean>) => {
      state.sortedByTime = action.payload;
    },
    setSortedByTimeRecent: (state, action: PayloadAction<boolean>) => {
      state.sortedByTimeRecent = action.payload;
    },
    setSortedByAmount: (state, action: PayloadAction<boolean>) => {
      state.sortedByAmount = action.payload;
    },
    setFilteredSortedByTime: (state, action: PayloadAction<boolean>) => {
      state.filteredSortedByTime = action.payload;
    },
    setFilteredSortedByTimeRecent: (state, action: PayloadAction<boolean>) => {
      state.filteredSortedByTimeRecent = action.payload;
    },
    setFilteredSortedByAmount: (state, action: PayloadAction<boolean>) => {
      state.filteredSortedByAmount = action.payload;
    },
    setFilteredTransfers: (state, action: PayloadAction<ITransfer[]>) => {
      state.filteredTransfers = action.payload;
    },
    setOriginal: (state, action: PayloadAction<boolean>) => {
      state.original = action.payload;
    },
    setType: (state, action: PayloadAction<"sender" | "recipient" | null>) => {
      state.type = action.payload;
    },

    addTransferToFiltered: (state, action: PayloadAction<ITransfer>) => {
      state.filteredTransfers = [
        action.payload,
        ...state.filteredTransfers.slice(0, 99),
      ];
    },
    addTransfer: (state, action: PayloadAction<ITransfer>) => {
      state.transFs = [action.payload, ...state.transFs.slice(0, 99)];
    },
    sortTransFsLowToHigh: (state) => {
      state.transFs.sort((a, b) => b.amount - a.amount);
    },
    sortTransFsHighToLow: (state) => {
      state.transFs.sort((a, b) => a.amount - b.amount);
    },
    sortFilteredTransfersLowToHigh: (state) => {
      state.filteredTransfers.sort((a, b) => b.amount - a.amount);
    },
    sortFilteredTransfersHighToLow: (state) => {
      state.filteredTransfers.sort((a, b) => a.amount - b.amount);
    },
    sortTransFsLowToHighTime: (state) => {
      state.transFs.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
    },
    sortTransFsHighToLowTime: (state) => {
      state.transFs.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
    },
    sortFilteredTransfersLowToHighTime: (state) => {
      state.filteredTransfers.sort(
        (a, b) => Number(a.timestamp) - Number(b.timestamp)
      );
    },
    sortFilteredTransfersHighToLowTime: (state) => {
      state.filteredTransfers.sort(
        (a, b) => Number(b.timestamp) - Number(a.timestamp)
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchPastTransfers.fulfilled,
      (state, action: PayloadAction<ITransfer[] | undefined>) => {
        if (action.payload) {
          state.filteredTransfers = action.payload;
        }
      }
    );
  },
});

export const {
  setTransFs,

  setSortedByTime,
  setSortedByTimeRecent,
  setSortedByAmount,
  setFilteredSortedByTime,
  setFilteredSortedByTimeRecent,
  setFilteredSortedByAmount,
  setFilteredTransfers,
  setOriginal,
  setType,

  addTransferToFiltered,
  addTransfer,
  sortFilteredTransfersHighToLow,
  sortFilteredTransfersLowToHigh,
  sortTransFsHighToLow,
  sortTransFsLowToHigh,
  sortFilteredTransfersHighToLowTime,
  sortFilteredTransfersLowToHighTime,
  sortTransFsHighToLowTime,
  sortTransFsLowToHighTime,
} = tableSlice.actions;

export const selectTransFs = (state: RootState) => state.table.transFs;

export const selectFilteredTransfers = (state: RootState) =>
  state.table.filteredTransfers;
export const selectOriginal = (state: RootState) => state.table.original;
export const selectType = (state: RootState) => state.table.type;
export const selectSortedByTime = (state: RootState) =>
  state.table.sortedByTime;
export const selectSortedByTimeRecent = (state: RootState) =>
  state.table.sortedByTimeRecent;
export const selectSortedByAmount = (state: RootState) =>
  state.table.sortedByAmount;
export const selectFilteredSortedByTime = (state: RootState) =>
  state.table.filteredSortedByTime;
export const selectFilteredSortedByTimeRecent = (state: RootState) =>
  state.table.filteredSortedByTimeRecent;
export const selectFilteredSortedByAmount = (state: RootState) =>
  state.table.filteredSortedByAmount;

export default tableSlice.reducer;
