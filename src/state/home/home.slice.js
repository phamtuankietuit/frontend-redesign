import { createSlice } from "@reduxjs/toolkit";

import { getProductsAsync, getProductsTopSellingMonthlyAsync, getProductsTopSellingWeeklyAsync, getProductsTrendyAsync } from "src/services/product/product.service";

const initialState = {
  trendy: [],
  trendyLoading: false,
  topSellingWeekly: [],
  topSellingWeeklyLoading: false,
  topSellingMonthly: [],
  topSellingMonthlyLoading: false,
  homeProducts: [],
  homeProductsLoading: false,
};

const homeSlice = createSlice({
  name: 'home',
  initialState,

  extraReducers: (builder) => {
    builder
      // trendy products
      .addCase(getProductsTrendyAsync.pending, (state) => {
        state.trendy = [];
        state.trendyLoading = true;
      })
      .addCase(getProductsTrendyAsync.fulfilled, (state, action) => {
        state.trendy = action.payload.items;
        state.trendyLoading = false;
      })
      .addCase(getProductsTrendyAsync.rejected, (state) => {
        state.trendy = [];
        state.trendyLoading = false;
      })

      // top selling weekly
      .addCase(getProductsTopSellingWeeklyAsync.pending, (state) => {
        state.topSellingWeekly = [];
        state.topSellingWeeklyLoading = true;
      })
      .addCase(getProductsTopSellingWeeklyAsync.fulfilled, (state, action) => {
        state.topSellingWeekly = action.payload.items;
        state.topSellingWeeklyLoading = false;
      })
      .addCase(getProductsTopSellingWeeklyAsync.rejected, (state) => {
        state.topSellingWeekly = [];
        state.topSellingWeeklyLoading = false;
      })

      // top selling monthly
      .addCase(getProductsTopSellingMonthlyAsync.pending, (state) => {
        state.topSellingMonthly = [];
        state.topSellingMonthlyLoading = true;
      })
      .addCase(getProductsTopSellingMonthlyAsync.fulfilled, (state, action) => {
        state.topSellingMonthly = action.payload.items;
        state.topSellingMonthlyLoading = false;
      })
      .addCase(getProductsTopSellingMonthlyAsync.rejected, (state) => {
        state.topSellingMonthly = [];
        state.topSellingMonthlyLoading = false;
      })

      // home products
      .addCase(getProductsAsync.pending, (state) => {
        state.homeProducts = [];
        state.homeProductsLoading = true;
      })
      .addCase(getProductsAsync.fulfilled, (state, action) => {
        state.homeProducts = action.payload.items;
        state.homeProductsLoading = false;
      })
      .addCase(getProductsAsync.rejected, (state) => {
        state.homeProducts = [];
        state.homeProductsLoading = false;
      })
      ;
  },
});


export const selectHome = (state) => state.home;

export default homeSlice.reducer;
