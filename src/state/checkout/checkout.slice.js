import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  subtotal: 0,
  total: 0,
  totalItems: 0,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
});

export const selectCheckout = (state) => state.checkout;

export default checkoutSlice.reducer;
