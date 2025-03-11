import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { toastMessage } from 'src/utils/constant';
import { passwordRegex, phoneNumberRegex } from 'src/utils/regex';

import { EmailInboxIcon } from 'src/assets/icons';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

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
        message:
          'Chứa ít nhất 1 chữ thường, 1 chữ hoa, 1 số và ít nhất 8 ký tự!',
      }),
    confirmPassword: zod.string().min(1, { message: toastMessage.error.empty }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp!',
    path: ['confirmPassword'],
  });

// ----------------------------------------------------------------------

export function CenteredRegisterView() {
  const router = useRouter();

  const password = useBoolean();

  const confirmPassword = useBoolean();

  const token = useSearchParams().get('token');

  const defaultValues = {
    name: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.info('DATA', data);

      toast.success('Đăng ký thành công. Vui lòng đăng nhập!');

      router.replace(paths.auth.signIn);
    } catch (error) {
      console.error(error);
      toast.success('Có lỗi xảy ra vui lòng thử lại!');
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
