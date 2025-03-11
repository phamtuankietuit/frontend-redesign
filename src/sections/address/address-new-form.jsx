import { z as zod } from 'zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
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

import { selectAddress } from 'src/state/address/address.slice';
import {
  getWards,
  getDistricts,
  getProvinces,
} from 'src/services/address/address.service';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// -----------------------s-----------------------------------------------

export const NewAddressSchema = zod.object({
  name: zod.string().min(1, { message: toastMessage.error.empty }),
  address: zod.string().min(1, { message: toastMessage.error.empty }),
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
  addressType: zod.string(),
  primary: zod.boolean(),
});

export function AddressNewForm({ open, onClose, onCreate }) {
  const dispatch = useDispatch();

  const { provinces, districts, wards } = useSelector(selectAddress);

  useEffect(() => {
    if (provinces.length === 0) {
      dispatch(getProvinces());
    }
  }, [dispatch, provinces]);

  const defaultValues = {
    addressType: 'Home',
    name: '',
    phoneNumber: '',
    address: '',
    province: null,
    district: null,
    ward: null,
    primary: false,
  };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewAddressSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'province' && value.province) {
        dispatch(getDistricts(value.province.ProvinceID));
        setValue('district', null);
        setValue('ward', null);
      } else if (name === 'district' && value.district) {
        dispatch(getWards(value.district.DistrictID));
        setValue('ward', null);
      }
    });
    return () => subscription.unsubscribe();
  }, [dispatch, watch, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('DATA', data);
      toast.success('Thêm địa chỉ thành công!');
      // onCreate({
      //   name: data.name,
      //   phoneNumber: data.phoneNumber,
      //   fullAddress: `${data.address}, ${data.city}, ${data.state}, ${data.country}, ${data.zipCode}`,
      //   addressType: data.addressType,
      //   primary: data.primary,
      // });
      onClose();
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Thêm địa chỉ</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3}>
            <Field.RadioGroup
              row
              name="addressType"
              options={[
                { label: 'Nhà ở', value: 'Home' },
                { label: 'Văn phòng', value: 'Office' },
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
              <Field.Text name="name" label="Họ và tên" />

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
              name="address"
              label="Địa chỉ chi tiết"
              placeholder="Số nhà, tên đường"
            />

            <Field.Checkbox name="primary" label="Đặt làm mặc định" />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onClose}>
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
