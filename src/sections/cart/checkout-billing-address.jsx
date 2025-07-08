import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

import { RouterLink } from 'src/routes/components';
import { resetStep1 } from 'src/state/cart/cart.slice';
import { CheckoutSummary } from './checkout-summary';
import { AccountBillingAddress } from '../account/account-billing-address';

// ----------------------------------------------------------------------

export function CheckoutBillingAddress() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetStep1());
  }, [dispatch]);

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={8}>
        <AccountBillingAddress />

        <Button
          component={RouterLink}
          href={paths.product.root}
          color="inherit"
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          sx={{ mt: 3 }}
        >
          Tiếp tục mua hàng
        </Button>
      </Grid>

      <Grid xs={12} md={4}>
        <CheckoutSummary />
      </Grid>
    </Grid>
  );
}
