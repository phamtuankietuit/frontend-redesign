import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/config-global';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { getCartItemsAsync } from 'src/services/cart/cart.service';
import { nextStep, selectCart } from 'src/state/cart/cart.slice';
import { CheckoutCartProductList } from './checkout-cart-product-list';
import { CheckoutSummary } from './checkout-summary';
import { CheckoutDiscount } from './checkout-discount';

// ----------------------------------------------------------------------

export function CheckoutCart() {
  const dispatch = useDispatch();

  const { items, selectedRowIds } = useSelector(selectCart);

  const empty = !items.length;

  const handleContinue = useCallback(() => {
    dispatch(nextStep());
  }, [dispatch]);

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={8}>
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={
              <Typography variant="h6">
                Giỏ hàng
                <Typography component="span" sx={{ color: 'text.secondary' }}>
                  &nbsp;(
                  {items.length || 0} sản phẩm)
                </Typography>
              </Typography>
            }
            sx={{ mb: 3 }}
          />

          {empty ? (
            <EmptyContent
              title="Giỏ hàng trống!"
              description="Bạn chưa có sản phẩm nào trong giỏ hàng."
              imgUrl={`${CONFIG.assetsDir}/assets/icons/empty/ic-cart.svg`}
              sx={{ pt: 5, pb: 10 }}
            />
          ) : (
            <CheckoutCartProductList />
          )}
        </Card>

        <Button
          component={RouterLink}
          href={paths.product.root}
          color="inherit"
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        >
          Tiếp tục mua hàng
        </Button>
      </Grid>

      <Grid xs={12} md={4}>
        <CheckoutSummary />

        <CheckoutDiscount />

        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          disabled={selectedRowIds.length === 0}
          onClick={handleContinue}
        >
          Tiếp tục
        </Button>
      </Grid>
    </Grid>
  );
}
