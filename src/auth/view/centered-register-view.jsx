import { z as zod } from 'zod';
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Radio, RadioGroup, Typography, FormControlLabel } from '@mui/material';

import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { toastMessage } from 'src/utils/constant';
import { passwordRegex, phoneNumberRegex } from 'src/utils/regex';

import { EmailInboxIcon } from 'src/assets/icons';
import { signUpAsync } from 'src/services/auth/auth.service';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { FormHead } from '../components/form-head';

// ----------------------------------------------------------------------

export const RegisterSchema = zod
  .object({
    name: zod.string().min(1, { message: toastMessage.error.empty }),
    phoneNumber: zod
      .string()
      .min(1, { message: toastMessage.error.empty })
      .regex(phoneNumberRegex, {
        message: 'Số điện thoại không hợp lệ!',
      }),
    password: zod
      .string()
      .min(1, { message: toastMessage.error.empty })
      .regex(passwordRegex, {
        message: toastMessage.error.invalidPassword,
      }),
    confirmPassword: zod.string().min(1, { message: toastMessage.error.empty }),
    gender: zod.string().min(1, { message: toastMessage.error.empty }),
    dateOfBirth: schemaHelper.date(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp!',
    path: ['confirmPassword'],
  });

// ----------------------------------------------------------------------

export function CenteredRegisterView() {
  const dispatch = useDispatch();

  const router = useRouter();

  const password = useBoolean();

  const confirmPassword = useBoolean();

  const token = useSearchParams().get('token');

  const defaultValues = {
    name: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    gender: '1',
    dateOfBirth: null,
  };

  const methods = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const body = {
        token,
        fullName: data.name,
        password: data.password,
        phoneNumber: data.phoneNumber,
        dateOfBirth: data.dateOfBirth,
        gender: Number(data.gender),
      };

      await dispatch(signUpAsync(body)).unwrap();

      toast.success('Đăng ký thành công!');

      router.replace('/');
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra vui lòng thử lại!');
    }
  });

  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Field.Text
        name="name"
        label="Họ tên"
        InputLabelProps={{ shrink: true }}
        autoFocus
      />

      <Field.Text
        name="phoneNumber"
        label="Số điện thoại"
        type="tel"
        InputLabelProps={{ shrink: true }}
      />

      <Field.DatePicker
        name="dateOfBirth"
        openTo="year"
        views={['day', 'month', 'year']}
        label="Ngày sinh"
        slotProps={{ textField: { fullWidth: true } }}
        disableFuture
      />

      <Box sx={{ ml: 1 }}>
        <Typography variant="subtitle2">Giới tính</Typography>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <RadioGroup {...field} row>
              <FormControlLabel
                value="1"
                control={<Radio size="medium" />}
                label="Nam"
              />
              <FormControlLabel
                value="2"
                control={<Radio size="medium" />}
                label="Nữ"
              />
              <FormControlLabel
                value="3"
                control={<Radio size="medium" />}
                label="Khác"
              />
            </RadioGroup>
          )}
        />
      </Box>

      <Field.Text
        name="password"
        label="Mật khẩu"
        type={password.value ? 'text' : 'password'}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify
                  icon={
                    password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'
                  }
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Field.Text
        name="confirmPassword"
        label="Xác nhận mật khẩu"
        type={confirmPassword.value ? 'text' : 'password'}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={confirmPassword.onToggle} edge="end">
                <Iconify
                  icon={
                    confirmPassword.value
                      ? 'solar:eye-bold'
                      : 'solar:eye-closed-bold'
                  }
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Đang đăng ký..."
      >
        Đăng ký
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        icon={<EmailInboxIcon />}
        title="Đăng ký"
        description="Nhập thông tin đăng ký để tạo tài khoản!"
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}
