import { createSlice } from "@reduxjs/toolkit";

import { getDistricts, getProvinces, getWards } from "src/services/address/address.service";

const initialState = {
  provinces: [],
  loadingProvinces: false,
  districts: [],
  loadingDistricts: false,
  wards: [],
  loadingWards: false,
};


const addressSlice = createSlice({
  name: 'address',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getProvinces.pending, (state) => {
        state.loadingProvinces = true;
      })
      .addCase(getProvinces.fulfilled, (state, action) => {
        action.payload.shift();
        state.provinces = action.payload;
        state.loadingProvinces = false;
      })
      .addCase(getProvinces.rejected, (state) => {
        state.loadingProvinces = false;
      })
      .addCase(getDistricts.pending, (state) => {
        state.loadingDistricts = true;
      })
      .addCase(getDistricts.fulfilled, (state, action) => {
        state.districts = action.payload;
        state.loadingDistricts = false;
      })
      .addCase(getDistricts.rejected, (state) => {
        state.loadingDistricts = false;
      })
      .addCase(getWards.pending, (state) => {
        state.loadingWards = true;
      })
      .addCase(getWards.fulfilled, (state, action) => {
        state.wards = action.payload;
        state.loadingWards = false;
      })
      .addCase(getWards.rejected, (state) => {
        state.loadingWards = false;
      });
  },
});

export const selectAddress = (state) => state.address;

export default addressSlice.reducer;
