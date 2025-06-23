import { createSlice } from "@reduxjs/toolkit";
import { getBannerByIdAsync, getBannersAsync } from "src/services/banner/banner.service";
import { getProductsCampaignAsync } from "src/services/product/product.service";
import { getPromotionsAsync } from "src/services/promotion/promotion.service";

const initialState = {
  banners: [],
  bannersLoading: false,
  // 
  banner: null,
  bannerLoading: false,
  // 
  promotions: [],
  promotionsLoading: false,
  // 
  products: [],
  productsLoading: false,
  productsTableFilters: {
    pageNumber: 1,
    pageSize: 30,
    sortBy: 'CreationTime',
    sortDirection: 'desc',
    productTypeIds: undefined,
  }
};

const campaignSlice = createSlice({
  name: 'campaign',
  initialState,
  extraReducers: (builder) => {
    builder
      // banners
      .addCase(getBannersAsync.pending, (state) => {
        state.banners = [];
        state.bannersLoading = true;
      })
      .addCase(getBannersAsync.fulfilled, (state, action) => {
        state.banners = action.payload.items;
        state.bannersLoading = false;
      })
      .addCase(getBannersAsync.rejected, (state) => {
        state.banners = [];
        state.bannersLoading = false;
      })

      // banner
      .addCase(getBannerByIdAsync.pending, (state) => {
        state.banner = null;
        state.bannerLoading = true;
      })
      .addCase(getBannerByIdAsync.fulfilled, (state, action) => {
        state.banner = action.payload;
        state.bannerLoading = false;
      })
      .addCase(getBannerByIdAsync.rejected, (state) => {
        state.banner = null;
        state.bannerLoading = false;
      })

      // products
      .addCase(getProductsCampaignAsync.pending, (state) => {
        state.products = [];
        state.productsLoading = true;
      })
      .addCase(getProductsCampaignAsync.fulfilled, (state, action) => {
        state.products = action.payload.items;
        state.productsLoading = false;
      })
      .addCase(getProductsCampaignAsync.rejected, (state) => {
        state.products = [];
        state.productsLoading = false;
      })

      // promotions 
      .addCase(getPromotionsAsync.pending, (state) => {
        state.promotions = [];
        state.promotionsLoading = true;
      })
      .addCase(getPromotionsAsync.fulfilled, (state, action) => {
        state.promotions = action.payload.items;
        state.promotionsLoading = false;
      })
      .addCase(getPromotionsAsync.rejected, (state) => {
        state.promotions = [];
        state.promotionsLoading = false;
      })
      ;
  },
});

export const selectCampaign = (state) => state.campaign;

export default campaignSlice.reducer;
