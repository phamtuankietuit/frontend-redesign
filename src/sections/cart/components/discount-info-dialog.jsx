import { useSelector } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { selectCart } from 'src/state/cart/cart.slice';
import { fDate, formatStr } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

export function DiscountInfoDialog({ open, onClose }) {
  const { discountInfo } = useSelector(selectCart);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle sx={{ p: 2 }}>Thông tin khuyến mãi</DialogTitle>

      <Divider sx={{ borderStyle: 'dashed', borderColor: 'divider' }} />

      <DialogContent dividers sx={{ p: 2, bgcolor: 'grey.200' }}>
        <Stack>
          <Typography
            variant="subtitle1"
            color="inherit"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {discountInfo?.name}
          </Typography>
          <Typography
            variant="subtitle2"
            color="grey.600"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {`Đơn hàng từ ${fCurrency(discountInfo?.minimumSpend)}`}
          </Typography>
          <Typography
            variant="subtitle2"
            color="grey.500"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {`${fDate(discountInfo?.startTime, formatStr.myFormat.date)} - ${fDate(discountInfo?.endTime, formatStr.myFormat.date)}`}
          </Typography>

          <Typography
            variant="subtitle1"
            color="grey.700"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Loại khách hàng áp dụng:{' '}
            {discountInfo?.customerTypeNames.join(', ')}
          </Typography>
          <Typography
            variant="subtitle1"
            color="grey.700"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Loại sản phẩm áp dụng:{' '}
            {discountInfo?.applyToProductTypeIdsList.includes(1)
              ? 'Tất Cả Nhóm Sản Phẩm'
              : discountInfo?.applyToProductTypeNames.join(', ')}
          </Typography>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
