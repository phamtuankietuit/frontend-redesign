import { createAsyncThunk } from "@reduxjs/toolkit";

import { schemeConfig } from "src/theme/scheme-config";

import { STORAGE_KEY } from "src/components/settings";

import { GET, PUT, POST } from "../axios";
import { deleteItem, sessionKey, setSession } from "../token.service";

export const signInAsync = createAsyncThunk(
  'auth/signInAsync',
  async (body) => {
    const { data } = await POST('/auth/sign-in', body);
    setSession(data);
    return data;
  }
);

export const sendSignUpEmailAsync = createAsyncThunk(
  'auth/sendSignUpEmailAsync',
  async (body) => {
    const { data } = await POST('/auth/send-sign-up-email', body);
    return data;
  }
);

export const signUpAsync = createAsyncThunk('auth/signUpAsync',
  async (body) => {
    const { data } = await POST('/auth/sign-up', body);
    setSession(data);
    return data;
  }
);

export const sendEmailForgotPasswordAsync = createAsyncThunk(
  'auth/sendEmailForgotPasswordAsync',
  async (body) => {
    const { data } = await POST('/auth/request-password-reset', body);
    return data;
  }
);

export const resetPasswordAsync = createAsyncThunk(
  'auth/resetPasswordAsync',
  async ({ id, body }) => {
    const { data } = await POST(`/auth/${id}/reset-password`, body);
    return data;
  }
);

export const getMeAsync = createAsyncThunk('auth/getMeAsync', async () => {
  const { data } = await GET(`/users/me`);
  return data;
});

export const updateMeAsync = createAsyncThunk(
  'auth/updateMeAsync',
  async ({ id, body }) => {
    const { data } = await PUT(`/users/${id}`, body);
    return data;
  }
);

export const updatePasswordAsync = createAsyncThunk(
  'auth/updatePasswordAsync',
  async ({ id, body }) => {
    const { data } = await POST(`/auth/${id}/change-password`, body);
    return data;
  }
);

export const signOut = () => {
  deleteItem(sessionKey);
  // RESET THEME
  deleteItem(STORAGE_KEY);
  deleteItem(schemeConfig.modeStorageKey);
};