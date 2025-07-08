import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { PRODUCT_CHECKOUT_STEPS } from 'src/_mock/_product';

import { selectCart } from 'src/state/cart/cart.slice';
import { CheckoutCart } from '../checkout-cart';
import { CheckoutSteps } from '../checkout-steps';
import { CheckoutPayment } from '../checkout-payment';
import { CheckoutBillingAddress } from '../checkout-billing-address';

// ----------------------------------------------------------------------

export function CartView() {
  const { step } = useSelector(selectCart);

  return (
    <Container sx={{ mb: 10 }}>
      <Typography variant="h4" sx={{ my: { xs: 3, md: 5 } }}>
        Giỏ hàng
      </Typography>

      <Grid container justifyContent="flex-start">
        <Grid xs={12} md={8}>
          <CheckoutSteps activeStep={step} steps={PRODUCT_CHECKOUT_STEPS} />
        </Grid>
      </Grid>

      <>
        {step === 0 && <CheckoutCart />}

        {step === 1 && <CheckoutBillingAddress />}

        {step === 2 && <CheckoutPayment />}
      </>
    </Container>
  );
}
