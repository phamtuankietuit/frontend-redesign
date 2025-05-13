import { createSlice } from "@reduxjs/toolkit";

import { getProductTypeByIdAsync } from "src/services/product-type/product-type.service";
import { getProductAsync, getProductsAsync, getProductOptionsAsync, getProductRatingsAsync } from "src/services/product/product.service";

const initialState = {
    product: null,
    productError: null,
    ratings: null,
    productTypes: [],
    productTypesBreadcrumb: [],
    productOptions: [],
    // 
    catalogPage: {
        products: [],
        loading: false,
        error: null,
        tableFilters: {
            pageNumber: 1,
            pageSize: 30,
            productTypeIds: undefined,
            sortBy: undefined,
            sortDirection: undefined,
            minPrice: 0,
            maxPrice: 999999999,
        },
        totalPages: 0,
    },
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        resetCatalogTableFilters: (state) => {
            state.catalogPage.tableFilters = initialState.catalogPage.tableFilters;
        },
        setCatalogTableFilters: (state, action) => {
            state.catalogPage.tableFilters = {
                ...state.catalogPage.tableFilters,
                ...action.payload,
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProductAsync.fulfilled, (state, action) => {
                state.product = action.payload;
            })
            .addCase(getProductAsync.rejected, (state, action) => {
                state.productError = action.error;
            })
            .addCase(getProductRatingsAsync.fulfilled, (state, action) => {
                state.ratings = action.payload;
            })
            .addCase(getProductRatingsAsync.rejected, (state, action) => {
                state.productError = action.error;
            })
            .addCase(getProductTypeByIdAsync.fulfilled, (state, action) => {
                state.productTypes = action.payload;
                state.productTypesBreadcrumb = action.payload.map((item) => ({
                    name: item.displayName,
                    href: `/products?productTypeId=${item.id}`,
                }));
            })
            .addCase(getProductOptionsAsync.fulfilled, (state, action) => {
                state.productOptions = action.payload;
            })
            .addCase(getProductsAsync.pending, (state) => {
                state.catalogPage.products = [];
                state.catalogPage.loading = true;
                state.catalogPage.error = null;
                state.catalogPage.totalPages = 0;
            })
            .addCase(getProductsAsync.fulfilled, (state, action) => {
                state.catalogPage.products = action.payload.items;
                state.catalogPage.loading = false;
                state.catalogPage.error = null;
                state.catalogPage.totalPages = action.payload.totalPages;
            })
            .addCase(getProductsAsync.rejected, (state, action) => {
                state.catalogPage.products = [];
                state.catalogPage.loading = false;
                state.catalogPage.error = action.error;
                state.catalogPage.totalPages = 0;
            });
    },
});

export const { setCatalogTableFilters, resetCatalogTableFilters } = productSlice.actions;

export const selectProduct = (state) => state.product;

export default productSlice.reducer;
