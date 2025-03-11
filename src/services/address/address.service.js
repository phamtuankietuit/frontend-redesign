import { createAsyncThunk } from "@reduxjs/toolkit";

import { ADDRESS_GET } from "../address-axios";

export const getProvinces = createAsyncThunk('address/getProvinces', async () => {
  const response = await ADDRESS_GET(`/province`);
  return response.data.data;
});

export const getDistricts = createAsyncThunk('address/getDistricts', async (provinceId) => {
  const response = await ADDRESS_GET(`/district`, {
    params: {
      province_id: provinceId,
    },
  });
  return response.data.data;
});

export const getWards = createAsyncThunk('address/getWards', async (districtId) => {
  const response = await ADDRESS_GET(`/ward`, {
    params: {
      district_id: districtId,
    },
  });
  return response.data.data;
});