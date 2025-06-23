import { createAsyncThunk } from "@reduxjs/toolkit";
import { GET, POST } from "../axios";

export const getCartItemsAsync = createAsyncThunk(
  'cart/getCartItemsAsync',
  async () => {
    const response = await GET(`/shopping-cart/items`);
    return response.data;
  }
);

export const addCartItemAsync = createAsyncThunk(
  'cart/addCartItemAsync',
  async (body) => {
    const response = await POST(`/shopping-cart/items/add`, body);
    return response.data;
  }
);

export const updateCartItemsAsync = createAsyncThunk(
  'cart/updateCartItemsAsync',
  async (body) => {
    const response = await POST(`/shopping-cart/items/update`, body);
    return response.data;
  }
);