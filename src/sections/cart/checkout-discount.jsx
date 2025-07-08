import { useBoolean } from 'src/hooks/use-boolean';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Stack,
  Typography,
} from '@mui/material';
import { selectCart } from 'src/state/cart/cart.slice';
import { Iconify } from 'src/components/iconify';
import { fCurrency } from 'src/utils/format-number';
import { CheckoutDiscountDialog } from './checkout-discount-dialog';

export function CheckoutDiscount() {
  const discountDialog = useBoolean(false);

  const { selectedRowIds, step, totalDiscounted, shippingDiscount } =
    useSelector(selectCart);

  return (
    <>
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Thông tin khuyến mãi" />

        <Stack spacing={2} sx={{ p: 3 }}>
          <Box display="flex">
            <Typography
              component="span"
              variant="body2"
              sx={{ flexGrow: 1, color: 'text.secondary' }}
            >
              Khuyến mãi áp dụng
            </Typography>
            <Typography component="span" variant="subtitle2">
              {totalDiscounted ? fCurrency(-totalDiscounted) : '-'}
            </Typography>
          </Box>

          {step === 2 && (
            <Box display="flex">
              <Typography
                component="span"
                variant="body2"
                sx={{ flexGrow: 1, color: 'text.secondary' }}
              >
                Giảm giá vận chuyển
              </Typography>
              <Typography component="span" variant="subtitle2">
                {shippingDiscount ? fCurrency(-shippingDiscount) : '-'}
              </Typography>
            </Box>
          )}

          <Button
            fullWidth
            color="primary"
            variant="outlined"
            startIcon={<Iconify icon="solar:discount-bold" />}
            onClick={discountDialog.onTrue}
            disabled={!selectedRowIds.length}
          >
            Chọn khuyến mãi
          </Button>
        </Stack>
      </Card>

      <CheckoutDiscountDialog
        open={discountDialog.value}
        onClose={discountDialog.onFalse}
      />
    </>
  );
}
