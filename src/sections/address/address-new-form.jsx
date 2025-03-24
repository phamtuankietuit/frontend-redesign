import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { toastMessage } from 'src/utils/constant';
import { phoneNumberRegex } from 'src/utils/regex';

import {
  getWardsAsync,
  getDistrictsAsync,
  getProvincesAsync,
} from 'src/services/address/address.service';
import {
  setWards,
  setAddress,
  setProvinces,
  setDistricts,
  selectAddress,
} from 'src/state/address/address.slice';

import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const NewAddressSchema = zod.object({
  receiverName: zod.string().min(1, { message: toastMessage.error.empty }),
  detailAddress: zod.string().min(1, { message: toastMessage.error.empty }),
  phoneNumber: zod
    .string()
    .min(1, { message: toastMessage.error.empty })
    .regex(phoneNumberRegex, {
      message: toastMessage.error.invalidPhoneNumber,
    }),
  province: schemaHelper.objectOrNull(),
  district: schemaHelper.objectOrNull(),
  ward: schemaHelper.objectOrNull(),
  // Not required
  type: zod.string(),
  isDefault: zod.boolean(),
});

export function AddressNewForm({ open, onClose, onCreate }) {
  const dispatch = useDispatch();

  const { address, provinces, districts, wards } = useSelector(selectAddress);

  const defaultValues = useMemo(
    () => ({
      type: String(address?.type || '1'),
      receiverName: address?.receiverName || '',
      phoneNumber: address?.phoneNumber || '',
      detailAddress: address?.detailAddress || '',
      province:
        provinces.find(
          (province) => province.ProvinceID === address?.provinceId,
        ) || null,
      district:
        districts.find(
          (district) => district.DistrictID === address?.districtId,
        ) || null,
      ward:
        wards.find((ward) => ward.WardCode === address?.communeCode) || null,
      isDefault: !!address?.isDefault,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [address],
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewAddressSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (provinces.length === 0) {
      dispatch(getProvincesAsync());
    }
  }, [dispatch, provinces]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'province' && value.province) {
        dispatch(getDistrictsAsync(value.province.ProvinceID));
        setValue('district', null);
        setValue('ward', null);
      } else if (name === 'district' && value.district) {
        dispatch(getWardsAsync(value.district.DistrictID));
        setValue('ward', null);
      }
    });
    return () => subscription.unsubscribe();
  }, [dispatch, watch, setValue]);

  useEffect(() => {
    if (address) {
      reset(defaultValues);
    }
  }, [address, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await onCreate({
        ...address,
        receiverName: data.receiverName,
        phoneNumber: data.phoneNumber,
        provinceId: data.province.ProvinceID,
        provinceName: data.province.ProvinceName,
        districtId: data.district.DistrictID,
        districtName: data.district.DistrictName,
        communeCode: data.ward.WardCode,
        communeName: data.ward.WardName,
        detailAddress: data.detailAddress,
        isDefault: data.isDefault,
        type: Number(data.type),
      });

      handleClearForm();
    } catch (error) {
      console.error(error);
    }
  });

  const handleClearForm = () => {
    dispatch(setAddress(null));
    dispatch(setProvinces([]));
    dispatch(setDistricts([]));
    dispatch(setWards([]));
    reset({
      type: '1',
      receiverName: '',
      phoneNumber: '',
      detailAddress: '',
      province: null,
      district: null,
      ward: null,
      isDefault: false,
    });
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>
          {address ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ'}
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3}>
            <Field.RadioGroup
              row
              name="type"
              options={[
                { label: 'Nhà ở', value: '1' },
                { label: 'Văn phòng', value: '2' },
              ]}
            />

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Field.Text name="receiverName" label="Họ và tên" />

              <Field.Text
                name="phoneNumber"
                label="Số điện thoại"
                placeholder="Số điện thoại"
              />
            </Box>

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns="repeat(1, 1fr)"
            >
              <Field.Autocomplete
                name="province"
                fullWidth
                options={provinces}
                getOptionLabel={(option) => option.ProvinceName}
                isOptionEqualToValue={(option, value) =>
                  option.ProvinceID === value.ProvinceID ||
                  value === null ||
                  value === undefined ||
                  value === ''
                }
                label="Tỉnh/Thành phố"
                renderOption={(props, option) => (
                  <li {...props} key={option.ProvinceID}>
                    {option.ProvinceName}
                  </li>
                )}
              />

              <Field.Autocomplete
                name="district"
                fullWidth
                options={districts}
                getOptionLabel={(option) => option.DistrictName}
                isOptionEqualToValue={(option, value) =>
                  option.DistrictID === value.DistrictID ||
                  value === null ||
                  value === undefined ||
                  value === ''
                }
                label="Quận/Huyện"
                renderOption={(props, option) => (
                  <li {...props} key={option.DistrictID}>
                    {option.DistrictName}
                  </li>
                )}
              />

              <Field.Autocomplete
                name="ward"
                fullWidth
                options={wards}
                getOptionLabel={(option) => option.WardName}
                isOptionEqualToValue={(option, value) =>
                  option.WardCode === value.WardCode ||
                  value === null ||
                  value === undefined ||
                  value === ''
                }
                label="Phường/Xã"
                renderOption={(props, option) => (
                  <li {...props} key={option.WardCode}>
                    {option.WardName}
                  </li>
                )}
              />
            </Box>

            <Field.Text
              name="detailAddress"
              label="Địa chỉ chi tiết"
              placeholder="Số nhà, tên đường"
            />

            <Field.Checkbox
              name="isDefault"
              label="Đặt làm mặc định"
              disabled={address?.isDefault}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={handleClearForm}>
            Hủy
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Lưu
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
