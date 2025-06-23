import { createAsyncThunk } from "@reduxjs/toolkit";
import { POST } from "../axios";

export const ratingProductAsync = createAsyncThunk(
  'rating/ratingProductAsync',
  async ({ productId, variantId, body }) => {
    const response = await POST(`/products/${productId}/variants/${variantId}/ratings`, body);
    return response.data;
  }
);