import { createSlice } from "@reduxjs/toolkit";

import { getProductTypeAttributesAsync, getProductTypeByIdAsync } from "src/services/product-type/product-type.service";
import { getProductAsync, getProductsAsync, getProductOptionsAsync, getProductRatingsAsync, likeCommentAsync, getProductRecommendationsAsync, getProductByImageAsync } from "src/services/product/product.service";

const initialState = {
    product: null,
    productError: null,
    ratings: {},
    productTypes: [],
    productTypesBreadcrumb: [],
    productOptions: [],
    // 
    productsRelated: [],
    productsRelatedLoading: false,
    // 
    catalogPage: {
        products: [],
        loading: false,
        error: null,
        tableFilters: {
            pageNumber: 1,
            pageSize: 30,
            productTypeIds: undefined,
            sortBy: 'CreationTime',
            sortDirection: 'desc',
            minPrice: 0,
            maxPrice: 999999999,
            searchQuery: '',
        },
        mode: 'ai',
        attributeFilters: {},
        expandedItems: [],
        totalPages: 0,
        // 
        breadcrumbs: [],
        attributes: [],
        loadingTreeView: false,
    },
    // 
    imageSearchPage: {
        products: [],
        loading: false,
        error: null,
        tableFilters: {
            pageNumber: 1,
            pageSize: 30,
        },
    },
    // 
    commentReport: null,
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        resetProductTypeList: (state) => {
            state.catalogPage.productTypeList = initialState.catalogPage.productTypeList;
        },
        setExpandedItems: (state, action) => {
            state.catalogPage.expandedItems = action.payload;
        },
        resetAttributeFilters: (state) => {
            state.catalogPage.attributeFilters = initialState.catalogPage.attributeFilters;
        },
        setAttributeFilters: (state, action) => {
            state.catalogPage.attributeFilters = {
                ...state.catalogPage.attributeFilters,
                [action.payload.attributeId]: action.payload.selectedValues
            };
        },
        resetCatalogTableFilters: (state) => {
            state.catalogPage.tableFilters = initialState.catalogPage.tableFilters;
        },
        setCatalogTableFilters: (state, action) => {
            state.catalogPage.tableFilters = {
                ...state.catalogPage.tableFilters,
                ...action.payload,
            };
        },
        setCommentReport: (state, action) => {
            state.commentReport = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // review
            .addCase(getProductRatingsAsync.fulfilled, (state, action) => {
                state.ratings = action.payload;
            })
            .addCase(likeCommentAsync.fulfilled, (state, action) => {
                const commentIndex = state.ratings.ratings.items.findIndex(item => item.id === action.payload.id);
                if (commentIndex !== -1) {
                    state.ratings.ratings.items[commentIndex] = action.payload;
                }
            })

            // catalog filters
            .addCase(getProductTypeByIdAsync.pending, (state) => {
                state.catalogPage.breadcrumbs = [];
                state.catalogPage.loadingTreeView = true;
            })
            .addCase(getProductTypeByIdAsync.fulfilled, (state, action) => {
                state.catalogPage.breadcrumbs =
                    action.payload?.map((item) => ({
                        name: item.displayName,
                        href: `/products?productTypeId=${item.id}`,
                    })) || [];
                state.productTypesBreadcrumb = action.payload?.map((item) => ({
                    name: item.displayName,
                    href: `/products?productTypeId=${item.id}`,
                })) || [];
                state.catalogPage.expandedItems = action.payload?.map((item) => String(item.id)) || [];
                state.catalogPage.loadingTreeView = false;
            })
            .addCase(getProductTypeAttributesAsync.fulfilled, (state, action) => {
                state.catalogPage.attributes = action.payload;
            })

            // product details 
            .addCase(getProductAsync.pending, (state) => {
                state.product = null;
                state.productError = null;
                state.productsRelated = [];
            })
            .addCase(getProductAsync.fulfilled, (state, action) => {
                state.product = action.payload;
                state.productError = null;
            })
            .addCase(getProductAsync.rejected, (state, action) => {
                state.product = null;
                state.productError = action.error;
                state.productsRelated = [];
            })
            .addCase(getProductOptionsAsync.fulfilled, (state, action) => {
                state.productOptions = action.payload;
            })

            // list
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
            })

            // recommendation 
            .addCase(getProductRecommendationsAsync.pending, (state) => {
                state.productsRelated = [];
                state.productsRelatedLoading = true;
            })
            .addCase(getProductRecommendationsAsync.fulfilled, (state, action) => {
                state.productsRelated = action.payload;
                state.productsRelatedLoading = false;
            })
            .addCase(getProductRecommendationsAsync.rejected, (state, action) => {
                state.productsRelated = [];
                state.productsRelatedLoading = false;
            })

            // image search
            .addCase(getProductByImageAsync.pending, (state) => {
                state.imageSearchPage.products = [];
                state.imageSearchPage.loading = true;
                state.imageSearchPage.error = null;
            })
            .addCase(getProductByImageAsync.fulfilled, (state, action) => {
                state.imageSearchPage.products = action.payload;
                state.imageSearchPage.loading = false;
                state.imageSearchPage.error = null;
            })
            .addCase(getProductByImageAsync.rejected, (state, action) => {
                state.imageSearchPage.products = [];
                state.imageSearchPage.loading = false;
                state.imageSearchPage.error = action.error;
            })
            ;
    },
});

export const
    {
        setCatalogTableFilters,
        resetCatalogTableFilters,
        setAttributeFilters,
        setExpandedItems,
        resetAttributeFilters,
        setCommentReport,
    } = productSlice.actions;

export const selectProduct = (state) => state.product;

export default productSlice.reducer;
