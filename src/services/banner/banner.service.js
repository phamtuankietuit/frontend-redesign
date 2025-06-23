import { createAsyncThunk } from "@reduxjs/toolkit";
import { GET } from "../axios";

export const getBannersAsync = createAsyncThunk(
  'banner/getBannersAsync',
  async (params) => {
    const response = await GET(`/banners`, { params });
    return response.data;
  }
);

export const getBannerByIdAsync = createAsyncThunk(
  'banner/getBannerByIdAsync',
  async (id) => {
    const response = await GET(`/banners/${id}`);
    return response.data;
  }
);

