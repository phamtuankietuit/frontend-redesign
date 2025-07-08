import { createSlice } from "@reduxjs/toolkit";
import { getDiscountPromotionsAsync, getFreeShippingPromotionsAsync, getPromotionsAsync } from "src/services/promotion/promotion.service";

const initialState = {
  discountPromotions: [],
  discountPromotionsLoading: false,
  // 
  freeShippingPromotions: [],
  freeShippingPromotionsLoading: false,
  // 
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
  extraReducers: (builder) => {
    builder
      // promotions  
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

      // discount promotions
      .addCase(getDiscountPromotionsAsync.pending, (state) => {
        state.discountPromotions = [];
        state.discountPromotionsLoading = true;
      })
      .addCase(getDiscountPromotionsAsync.fulfilled, (state, action) => {
        state.discountPromotions = action.payload.items;
        state.discountPromotionsLoading = false;
      })
      .addCase(getDiscountPromotionsAsync.rejected, (state) => {
        state.discountPromotions = [];
        state.discountPromotionsLoading = false;
      })

      // free shipping promotions
      .addCase(getFreeShippingPromotionsAsync.pending, (state) => {
        state.freeShippingPromotions = [];
        state.freeShippingPromotionsLoading = true;
      })
      .addCase(getFreeShippingPromotionsAsync.fulfilled, (state, action) => {
        state.freeShippingPromotions = action.payload.items;
        state.freeShippingPromotionsLoading = false;
      })
      .addCase(getFreeShippingPromotionsAsync.rejected, (state) => {
        state.freeShippingPromotions = [];
        state.freeShippingPromotionsLoading = false;
      })
      ;
  },
});

export const selectPromotion = (state) => state.promotion;

export default promotionSlice.reducer;
