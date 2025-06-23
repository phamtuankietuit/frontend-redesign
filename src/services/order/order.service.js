import { createAsyncThunk } from "@reduxjs/toolkit";
import { GET, PATCH } from "../axios";

export const getOrdersAsync = createAsyncThunk(
  'order/getOrdersAsync',
  async () => {
    const response = await GET(`/orders`);
    return response.data;
  }
);

export const getOrderByIdAsync = createAsyncThunk(
  'order/getOrderByIdAsync',
  async (id) => {
    const response = await GET(`/orders/${id}`);
    return response.data;
  }
);

// confirm received order 
export const confirmReceivedOrderAsync = createAsyncThunk(
  'order/confirmReceivedOrderAsync',
  async ({ id, body }) => {
    const response = await PATCH(`/orders/${id}/confirm-received`, body);
    return response.data;
  }
);