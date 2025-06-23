import { createAsyncThunk } from "@reduxjs/toolkit";
import { GET, POST } from "../axios";

export const getPromotionsAsync = createAsyncThunk(
  'promotion/getPromotionsAsync',
  async (body) => {
    const response = await POST(`/discount-vouchers/list`, body);
    return response.data;
  }
);

export const getPromotionByIdAsync = createAsyncThunk(
  'promotion/getPromotionByIdAsync',
  async (id) => {
    const response = await GET(`/discount-vouchers/${id}`);
    return response.data;
  }
);
