import { createSlice } from "@reduxjs/toolkit";
import { getPromotionsAsync } from "src/services/promotion/promotion.service";

const initialState = {
  promotions: [],
  loading: false,
  tableFilters: {
    pageNumber: 1,
    pageSize: 100,
  }
};

const promotionSlice = createSlice({
  name: 'promotion',
  initialState,
  // reducers: {

  // },
  extraReducers: (builder) => {
    builder
      .addCase(getPromotionsAsync.pending, (state) => {
        state.promotions = [];
        state.loading = true;
      })
      .addCase(getPromotionsAsync.fulfilled, (state, action) => {
        state.promotions = action.payload.items;
        state.loading = false;
      })
      .addCase(getPromotionsAsync.rejected, (state) => {
        state.promotions = [];
        state.loading = false;
      })
      ;
  },
});

export const selectPromotion = (state) => state.promotion;

export default promotionSlice.reducer;
