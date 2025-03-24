import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { toastMessage } from 'src/utils/constant';

import { CONFIG } from 'src/config-global';
import { sendSignUpEmailAsync } from 'src/services/auth/auth.service';

import { toast } from 'src/components/snackbar';
import { AnimateLogo2 } from 'src/components/animate';
import { Form, Field } from 'src/components/hook-form';

import { FormHead } from '../components/form-head';
import { FormReturnLink } from '../components/form-return-link';

// ----------------------------------------------------------------------

export const SignUpSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: toastMessage.error.empty })
    .email({ message: toastMessage.error.invalidEmail }),
});

// ----------------------------------------------------------------------

export function CenteredSignUpView() {
  const dispatch = useDispatch();

  const defaultValues = {
    email: '',
  };

  const methods = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await dispatch(
        sendSignUpEmailAsync({
          email: data.email,
          redirectUrlBase: CONFIG.frontendUrl + paths.auth.register,
        }),
      ).unwrap();

      toast.success('Vui lòng kiểm tra email để tiếp tục!');
    } catch (error) {
      console.error(error);
    }
  });

  const renderLogo = <AnimateLogo2 sx={{ mb: 3, mx: 'auto' }} />;

  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Field.Text
        name="email"
        label="Email"
        InputLabelProps={{ shrink: true }}
        autoFocus
      />

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Đang xác thực..."
      >
        Đăng ký
      </LoadingButton>
    </Box>
  );

  return (
    <>
      {renderLogo}

      <FormHead
        title="Đăng ký"
        description={
          <>
            {`Đã có tài khoản? `}
            <Link
              component={RouterLink}
              href={paths.auth.signIn}
              variant="subtitle2"
            >
              Đăng nhập
            </Link>
          </>
        }
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>

      <FormReturnLink label="Trở về Đăng nhập" href={paths.auth.signIn} />
    </>
  );
}
