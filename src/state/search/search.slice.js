import { createSlice } from "@reduxjs/toolkit";

import { searchProductsAsync } from "src/services/product/product.service";

const initialState = {
  results: [],
  loading: false,
  totalCount: 0,
  tableFilters: {
    pageNumber: 1,
    pageSize: 10,
    searchQuery: '',
  },
  mode: 'normal',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    setTableFilters: (state, action) => {
      state.tableFilters = {
        ...state.tableFilters,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProductsAsync.pending, (state) => {
        state.results = [];
        state.totalCount = 0;
        state.loading = true;
      })
      .addCase(searchProductsAsync.fulfilled, (state, action) => {
        state.results = action.payload.items;
        state.totalCount = action.payload.totalCount;
        state.loading = false;
      })
      .addCase(searchProductsAsync.rejected, (state) => {
        state.results = [];
        state.totalCount = 0;
        state.loading = false;
      });
  },
});

export const { setTableFilters, setMode } = searchSlice.actions;

export const selectSearch = (state) => state.search;

export default searchSlice.reducer;
