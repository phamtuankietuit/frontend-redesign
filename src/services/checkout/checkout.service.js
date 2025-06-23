import { createAsyncThunk } from "@reduxjs/toolkit";
import { GET, POST } from "../axios";

export const checkoutConfirm = createAsyncThunk(
  'checkout/checkoutConfirm',
  async (body) => {
    const response = await POST(`/check-outs/confirm`, body);
    return response.data;
  }
);

export const checkoutPlaceOrder = createAsyncThunk(
  'checkout/checkoutPlaceOrder',
  async (body) => {
    const response = await POST(`/check-outs/place-order`, body);
    return response.data;
  }
);

export const checkoutIPN = createAsyncThunk(
  'checkout/checkoutIPN',
  async (params) => {
    const response = await GET(`/check-outs/ipn`,
      {
        params
      }
    );
    return response.data;
  }
);

