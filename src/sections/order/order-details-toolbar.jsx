import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { fDateTime, formatStr } from 'src/utils/format-time';

import {
  getOrderByIdAsync,
  updateOrderStatusAsync,
} from 'src/services/order/order.service';
import { useBoolean } from 'src/hooks/use-boolean';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

export function OrderDetailsToolbar({
  status,
  backLink,
  createdAt,
  orderNumber,
  order,
}) {
  const dispatch = useDispatch();

  const loadingCancel = useBoolean(false);

  const handleCancel = async () => {
    try {
      loadingCancel.onTrue();

      await dispatch(
        updateOrderStatusAsync({
          id: order.id,
          body: { status: 7, reason: '', notes: '' },
        }),
      ).unwrap();

      await dispatch(getOrderByIdAsync(order?.id)).unwrap();

      toast.success('Hủy đơn hàng thành công!');
    } catch (error) {
      console.error('Error canceling order:', error);
      toast.error('Hủy đơn hàng thất bại');
    } finally {
      loadingCancel.onFalse();
    }
  };

  const loadingConfirm = useBoolean(false);

  const handleConfirm = async () => {
    try {
      loadingConfirm.onTrue();

      await dispatch(
        updateOrderStatusAsync({
          id: order.id,
          body: { status: 6, reason: '', notes: '' },
        }),
      ).unwrap();

      await dispatch(getOrderByIdAsync(order?.id)).unwrap();

      toast.success('Xác nhận đơn hàng thành công!');
    } catch (error) {
      console.error('Error confirm order:', error);
      toast.error('Xác nhận đơn hàng thất bại');
    } finally {
      loadingConfirm.onFalse();
    }
  };

  return (
    <Stack
      spacing={3}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ mb: { xs: 3, md: 5 } }}
    >
      <Stack spacing={1} direction="row" alignItems="flex-start">
        <IconButton component={RouterLink} href={backLink}>
          <Iconify icon="eva:arrow-ios-back-fill" />
        </IconButton>

        <Stack spacing={0.5}>
          <Stack spacing={1} direction="row" alignItems="center">
            <Typography variant="h4"> Đơn hàng {orderNumber} </Typography>
            <Label
              variant="soft"
              color={
                (status === 'Pending' && 'warning') ||
                (status === 'WaitForConfirmPackageBranch' && 'warning') ||
                (status === 'Packaging' && 'warning') ||
                (status === 'Processing' && 'info') ||
                (status === 'Shipped' && 'info') ||
                (status === 'Delivered' && 'success') ||
                (status === 'Received' && 'success') ||
                (status === 'Cancelled' && 'error') ||
                (status === 'Refunded' && 'error') ||
                'default'
              }
            >
              {status === 'Pending' && 'Chờ xác nhận'}
              {status === 'WaitForConfirmPackageBranch' && 'Chờ chọn kho'}
              {status === 'Packaging' && 'Đang đóng hàng'}
              {status === 'Processing' && 'Chờ lấy hàng'}
              {status === 'Shipped' && 'Đang giao hàng'}
              {status === 'Delivered' && 'Đã giao'}
              {status === 'Received' && 'Đã nhận'}
              {status === 'Cancelled' && 'Đã hủy'}
              {status === 'Refunded' && 'Trả hàng'}
            </Label>
          </Stack>

          <Typography variant="body2" sx={{ color: 'text.disabled' }}>
            {fDateTime(createdAt, formatStr.myFormat.dateTime)}
          </Typography>
        </Stack>
      </Stack>

      <Stack
        flexGrow={1}
        spacing={1.5}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
      >
        {(status === 'Pending' ||
          status === 'WaitForConfirmPackageBranch' ||
          status === 'Packaging') && (
          <LoadingButton
            color="error"
            variant="outlined"
            onClick={handleCancel}
            loading={loadingCancel.value}
          >
            Hủy đơn
          </LoadingButton>
        )}

        {status === 'Delivered' && (
          <LoadingButton
            color="primary"
            variant="contained"
            onClick={handleConfirm}
            loading={loadingConfirm.value}
          >
            Đã nhận
          </LoadingButton>
        )}
      </Stack>
    </Stack>
  );
}
