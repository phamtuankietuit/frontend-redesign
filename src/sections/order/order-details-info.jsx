import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';

import { fDate, formatStr } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export function OrderDetailsInfo({ order }) {
  const renderDelivery = (
    <>
      <CardHeader title="Đơn vị vận chuyển" />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row" alignItems="center">
          <Box
            component="span"
            sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}
          >
            Giao bởi
          </Box>
          GHN
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box
            component="span"
            sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}
          >
            Dự kiến giao
          </Box>
          {fDate(order?.expectedDeliveryWhen, formatStr.myFormat.date)}
        </Stack>
      </Stack>
    </>
  );

  const renderShipping = (
    <>
      <CardHeader title="Địa chỉ nhận hàng" />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row">
          <Box
            component="span"
            sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}
          >
            Người nhận
          </Box>
          {order?.shippingAddress?.receiverName}
        </Stack>

        <Stack direction="row">
          <Box
            component="span"
            sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}
          >
            Địa chỉ
          </Box>
          {order?.shippingAddress?.detailedFullAddress}
        </Stack>

        <Stack direction="row">
          <Box
            component="span"
            sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}
          >
            Số điện thoại
          </Box>
          {order?.shippingAddress?.phoneNumber}
        </Stack>
      </Stack>
    </>
  );

  const renderPayment = (
    <>
      <CardHeader title="Phương thức thanh toán" />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        sx={{ p: 3, gap: 0.5, typography: 'body2' }}
      >
        {order?.paymentMethod?.name}
      </Box>
    </>
  );

  return (
    <Card>
      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderDelivery}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderShipping}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderPayment}
    </Card>
  );
}
