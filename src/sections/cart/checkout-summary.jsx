import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { useSelector } from 'react-redux';
import { selectCart } from 'src/state/cart/cart.slice';
import { Skeleton } from '@mui/material';

// ----------------------------------------------------------------------

export function CheckoutSummary({ onEdit }) {
  const {
    step,
    subtotal,
    totalSaved,
    total,
    summaryLoading,
    totalDiscounted,
    shippingDiscount,
    shippingFee,
  } = useSelector(selectCart);

  if (summaryLoading) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Thông tin đơn hàng" />
        <Stack spacing={2} sx={{ p: 2 }}>
          {[...Array(3)].map((_, index) => (
            <Skeleton
              key={index}
              variant="rounded"
              width="100%"
              height={48}
              animation="wave"
            />
          ))}
        </Stack>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title="Thông tin đơn hàng"
        action={
          onEdit && (
            <Button
              size="small"
              onClick={onEdit}
              startIcon={<Iconify icon="solar:pen-bold" />}
            >
              Sửa
            </Button>
          )
        }
      />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Box display="flex">
          <Typography
            component="span"
            variant="body2"
            sx={{ flexGrow: 1, color: 'text.secondary' }}
          >
            Tổng tiền hàng
          </Typography>
          <Typography component="span" variant="subtitle2">
            {fCurrency(subtotal)}
          </Typography>
        </Box>

        <Box display="flex">
          <Typography
            component="span"
            variant="body2"
            sx={{ flexGrow: 1, color: 'text.secondary' }}
          >
            Giảm giá
          </Typography>
          <Typography component="span" variant="subtitle2">
            {totalSaved ? fCurrency(-totalSaved) : '-'}
          </Typography>
        </Box>

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
              Phí vận chuyển
            </Typography>
            <Typography component="span" variant="subtitle2">
              {shippingFee ? fCurrency(shippingFee) : '-'}
            </Typography>
          </Box>
        )}

        {step === 2 && (
          <Box display="flex">
            <Typography
              component="span"
              variant="body2"
              sx={{ flexGrow: 1, color: 'text.secondary' }}
            >
              Giảm giá phí vận chuyển
            </Typography>
            <Typography component="span" variant="subtitle2">
              {shippingDiscount ? fCurrency(-shippingDiscount) : '-'}
            </Typography>
          </Box>
        )}

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box display="flex">
          <Typography component="span" variant="subtitle1" sx={{ flexGrow: 1 }}>
            Tổng cộng
          </Typography>

          <Box sx={{ textAlign: 'right' }}>
            <Typography
              component="span"
              variant="subtitle1"
              sx={{ display: 'block', color: 'error.main' }}
            >
              {fCurrency(total)}
            </Typography>
            {totalSaved > 0 && (
              <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                (Bạn đã tiết kiệm được{' '}
                {fCurrency(totalSaved + totalDiscounted + shippingDiscount)})
              </Typography>
            )}
          </Box>
        </Box>

        {/* {onApplyDiscount && (
          <TextField
            fullWidth
            placeholder="Discount codes / Gifts"
            value="DISCOUNT5"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    color="primary"
                    onClick={() => onApplyDiscount(5)}
                    sx={{ mr: -0.5 }}
                  >
                    Áp dụng
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        )} */}
      </Stack>
    </Card>
  );
}
