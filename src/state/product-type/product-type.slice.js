import { createSlice } from "@reduxjs/toolkit";

import { transformProductTypes } from "src/utils/helper";

import { getProductTypesAsync, getProductTypeByIdAsync, getProductTypesFlattenAsync, getProductTypeAttributesAsync } from "src/services/product-type/product-type.service";

const initialState = {
  productTypes: [],
  productTypesFlatten: [],
  catalogPage: {
    productTypeList: [],
    loadingTreeView: false,
    listAttributes: [],
  },
  homePage: {
    tabs: [],
  },
  treeView: {
    items: []
  }
};

const productTypeSlice = createSlice({
  name: 'productType',
  initialState,
  reducers: {
    resetProductTypeList: (state) => {
      state.catalogPage.productTypeList = initialState.catalogPage.productTypeList;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProductTypesAsync.fulfilled, (state, action) => {
        state.productTypes = action.payload;
        state.homePage.tabs = action.payload.map((item) => ({
          value: item.id,
          label: item.displayName,
        }));
      })
      .addCase(getProductTypesFlattenAsync.fulfilled, (state, action) => {
        state.productTypesFlatten = action.payload;
        state.treeView.items = transformProductTypes(action.payload);
      })
      .addCase(getProductTypeByIdAsync.pending, (state) => {
        state.catalogPage.loadingTreeView = true;
      })
      .addCase(getProductTypeByIdAsync.fulfilled, (state, action) => {
        state.catalogPage.productTypeList = action.payload;
        state.catalogPage.loadingTreeView = false;
      })
      .addCase(getProductTypeAttributesAsync.fulfilled, (state, action) => {
        state.catalogPage.listAttributes = action.payload;
      });
  },
});

export const { resetProductTypeList } = productTypeSlice.actions;

export const selectProductType = (state) => state.productType;

export default productTypeSlice.reducer;
