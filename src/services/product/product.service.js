import { createAsyncThunk } from "@reduxjs/toolkit";

import { GET, PUT, POST } from "../axios";

export const getProductAsync = createAsyncThunk(
    'product/getProductAsync',
    async (id) => {
        const response = await GET(`/products/${id}`);
        return response.data;
    }
);

export const getProductsAsync = createAsyncThunk(
    'product/getProductsAsync',
    async (body) => {
        const response = await POST(`/products/list`, body);
        return response.data;
    }
);

export const searchProductsAsync = createAsyncThunk(
    'product/searchProductsAsync',
    async (body) => {
        const response = await POST(`/products/list`, body);
        return response.data;
    }
);

export const createProductAsync = createAsyncThunk(
    'product/createProductAsync',
    async (body) => {
        const response = await POST(`/products`, body);
        return response.data;
    }
);

export const getProductOptionsAsync = createAsyncThunk(
    'product/getProductOptionsAsync',
    async (id) => {
        const response = await GET(`/products/${id}/options`);
        return response.data.items;
    }
);

export const updateProductAsync = createAsyncThunk(
    'product/updateProductAsync',
    async ({ id, body }, { rejectWithValue }) => {
        try {
            const response = await PUT(`/products/${id}`, body);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// review

export const getProductRatingsAsync = createAsyncThunk(
    'product/getProductRatingsAsync',
    async (params) => {
        const response = await GET(`/products/${params.productId}/ratings`, { params });
        return response.data;
    }
);

export const likeCommentAsync = createAsyncThunk(
    'product/likeCommentAsync',
    async ({ id, ratingId, customerId }) => {
        const response = await POST(`/products/${id}/ratings/${ratingId}/like`, {
            ratingId,
            customerId
        });
        return response.data;
    }
);

export const reportCommentAsync = createAsyncThunk(
    'product/reportCommentAsync',
    async ({ id, ratingId, body }) => {
        const response = await POST(`/products/${id}/ratings/${ratingId}/report`, body);
        return response.data;
    }
);

// image search
export const getProductByImageAsync = createAsyncThunk(
    'product/getProductByImageAsync',
    async (body) => {
        const response = await POST(`/products/related/by-image`, { base64Image: body });
        return response.data;
    }
);

// recommendation
export const getProductRecommendationsAsync = createAsyncThunk(
    'product/getProductRecommendationsAsync',
    async (id) => {
        const response = await GET(`/products/${id}/related`);
        return response.data;
    }
);

// campaign
export const getProductsCampaignAsync = createAsyncThunk(
    'product/getProductsCampaignAsync',
    async (body) => {
        const response = await POST(`/products/list`, body);
        return response.data;
    }
);

// home
export const getProductsTrendyAsync = createAsyncThunk(
    'product/getProductsTrendyAsync',
    async () => {
        const response = await GET(`/products/trendy`);
        return response.data;
    }
);

export const getProductsTopSellingWeeklyAsync = createAsyncThunk(
    'product/getProductsTopSellingWeeklyAsync',
    async () => {
        const response = await GET(`/products/top-selling/weekly`);
        return response.data;
    }
);

export const getProductsTopSellingMonthlyAsync = createAsyncThunk(
    'product/getProductsTopSellingMonthlyAsync',
    async (params) => {
        const response = await GET(`/products/top-selling/monthly`, { params });
        return response.data;
    }
);
