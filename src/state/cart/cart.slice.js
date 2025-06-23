import { createSlice } from "@reduxjs/toolkit";

import { getCartItemsAsync, updateCartItemsAsync } from "src/services/cart/cart.service";
import { checkoutConfirm } from "src/services/checkout/checkout.service";

const initialState = {
  items: [],
  loading: false,
  totalCount: 0,
  selectedRowIds: [],
  subtotal: 0,
  total: 0,
  totalSaved: 0,
  totalDiscounted: 0,
  summaryLoading: false,
  // 
  step: 0, // 0: cart, 1: delivery, 2: payment
  // 0: cart
  discountSelected: null,
  orderVoucherDiscount: 0,
  // 1: delivery
  addressSelected: null,
  // 2: payment
  shippingFee: 0,
  freeShippingSelected: null,
  shippingDiscount: 0,
  deliveryMethods: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    nextStep: (state) => {
      state.step += 1;
    },
    backStep: (state) => {
      if (state.step > 0) {
        state.step -= 1;
      }
    },
    goToStep: (state, action) => {
      const step = action.payload;
      if (step >= 0 && step <= 2) {
        state.step = step;
      }
    },
    pickAddress: (state, action) => {
      state.addressSelected = action.payload;
    },
    pickDiscount: (state, action) => {
      state.discountSelected = action.payload;
    },
    pickFreeShipping: (state, action) => {
      state.freeShippingSelected = action.payload;
    },
    resetSelection: (state) => {
      state.selectedRowIds = [];
      state.subtotal = 0;
      state.total = 0;
      state.totalSaved = 0;
      state.totalPrice = 0;
      state.step = 0;
      state.discountSelected = null;
      state.orderVoucherDiscount = 0;
      state.addressSelected = null;
      state.shippingFee = 0;
      state.freeShippingSelected = null;
      state.shippingDiscount = 0;
    },
    onSelectAllRows: (state, action) => {
      if (action.payload.checked) {
        state.selectedRowIds = action.payload.inputValue;
      } else {
        state.selectedRowIds = [];
      }
    },
    onSelectRow: (state, action) => {
      const inputValue = action.payload;
      const newSelected = state.selectedRowIds.includes(inputValue)
        ? state.selectedRowIds.filter((value) => value !== inputValue)
        : [...state.selectedRowIds, inputValue];
      state.selectedRowIds = newSelected;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCartItemsAsync.pending, (state) => {
        state.items = [];
        state.totalCount = 0;
        state.loading = true;
      })
      .addCase(getCartItemsAsync.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalCount = action.payload.totalCount;
        state.loading = false;
      })
      .addCase(getCartItemsAsync.rejected, (state) => {
        state.items = [];
        state.totalCount = 0;
        state.loading = false;
      })

      // update
      .addCase(updateCartItemsAsync.pending, (state) => {
        state.summaryLoading = true;
      })
      .addCase(updateCartItemsAsync.fulfilled, (state, action) => {
        if (action.payload?.updatedItems) {
          const updatedItems = action.payload.updatedItems;
          state.items = state.items.map((item) => {
            const updatedItem = updatedItems.find((i) => i.id === item.id);
            return updatedItem ? { ...item, ...updatedItem } : item;
          });
        }

        if (action.payload?.discountDetail) {
          state.subtotal = action.payload?.discountDetail.subtotal;
          state.total = action.payload?.discountDetail.total;
          state.totalSaved = action.payload?.discountDetail.totalSaved;
          state.totalDiscounted = action.payload?.discountDetail.totalDiscounted;
        }

        state.summaryLoading = false;
      })
      .addCase(updateCartItemsAsync.rejected, (state) => {
        state.summaryLoading = false;
      })

      // confirm 
      .addCase(checkoutConfirm.fulfilled, (state, action) => {
        state.subtotal = action.payload.priceSummary.subtotal;
        state.totalSaved = action.payload.priceSummary.productDiscount;
        state.shippingFee = action.payload.priceSummary.shippingFee;
        state.orderVoucherDiscount = action.payload.priceSummary.orderVoucherDiscount;
        state.shippingDiscount = action.payload.priceSummary.shippingDiscount;
        state.total = action.payload.priceSummary.total;

        // 
        state.deliveryMethods = action.payload.deliveryMethods || [];
      })
      ;
  },
});

export const
  {
    onSelectAllRows,
    onSelectRow,
    resetSelection,
    nextStep,
    pickAddress,
    backStep,
    goToStep,
    pickDiscount,
    pickFreeShipping,
  } = cartSlice.actions;

export const selectCart = (state) => state.cart;

export default cartSlice.reducer;
