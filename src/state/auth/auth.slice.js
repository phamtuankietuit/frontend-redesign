import { createSlice } from "@reduxjs/toolkit";

// import { socket } from "src/hooks/use-socket";

import { getMeAsync, signInAsync, sendSignUpEmailAsync } from "src/services/auth/auth.service";

import { toast } from 'src/components/snackbar';

const initialState = {
  user: null,
  signUp: {},
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOut: (state) => {
      Object.assign(state, initialState);
      // socket.disconnect();
    },
    setSignUp: (state, action) => {
      state.signUp = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getMeAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        // socket.emit('add-user', action.payload.id);
      })
      .addCase(sendSignUpEmailAsync.rejected, (state, action) => {
        if (action.error.message === 'Request failed with status code 409') {
          toast.error('Email đã được đăng ký!');
        } else {
          toast.error('Có lỗi xảy ra vui lòng thử lại!');
        }
      });
  },
});

export const { signOut, setSignUp } = authSlice.actions;

export const selectAuth = (state) => state.auth;

export default authSlice.reducer;