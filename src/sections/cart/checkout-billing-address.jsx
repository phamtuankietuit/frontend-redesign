import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import { useBoolean } from 'src/hooks/use-boolean';

import { _addressBooks } from 'src/_mock';
import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

import { RouterLink } from 'src/routes/components';
import { useCheckoutContext } from './context';
import { CheckoutSummary } from './checkout-summary';
import { AddressItem, AddressNewForm } from '../address';
import { AccountBillingAddress } from '../account/account-billing-address';
import { CheckoutDiscount } from './checkout-discount';

// ----------------------------------------------------------------------

export function CheckoutBillingAddress() {
  const checkout = {};

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
        <CheckoutSummary
          total={checkout.total}
          subtotal={checkout.subtotal}
          discount={checkout.discount}
        />
      </Grid>
    </Grid>
  );
}
