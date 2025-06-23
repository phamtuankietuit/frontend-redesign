import { useRouter, useSearchParams } from 'src/routes/hooks';
import { Box, Button, Divider, Typography } from '@mui/material';
import { paths } from 'src/routes/paths';
import OrderCompleteIllustration from 'src/assets/illustrations/order-complete-illustration';
import { Iconify } from 'src/components/iconify';
import MaintenanceIllustration from 'src/assets/illustrations/maintenance-illustration';

export function PlaceOrderStatusView() {
  const params = useSearchParams();

  const vnp_ResponseCode = params.get('vnp_ResponseCode');

  const router = useRouter();

  const handleReturn = () => {
    router.replace(paths.product.root);
  };

  const handleOrderList = () => {
    router.push(paths.account.orders);
  };

  return (
    <Box
      gap={5}
      display="flex"
      alignItems="center"
      flexDirection="column"
      sx={{
        m: 'auto',
        maxWidth: 480,
        textAlign: 'center',
        px: { xs: 2, sm: 0 },
      }}
    >
      <Typography variant="h4">
        {vnp_ResponseCode === '00'
          ? `Đặt hàng thành công!`
          : `Đặt hàng thất bại!`}
      </Typography>

      {vnp_ResponseCode === '00' ? (
        <OrderCompleteIllustration />
      ) : (
        <MaintenanceIllustration />
      )}

      {vnp_ResponseCode === '00' ? (
        <Typography>
          Cảm ơn bạn đã đặt hàng tại KKBooks
          <br />
          <br />
          Chúng tôi sẽ gửi thông báo và email về trạng thái đơn hàng.
          <br /> Nếu bạn có thắc mắc hoặc vấn đề về đơn hàng vui lòng liên hệ:
          <br />
          <span className="font-bold">1800 6236</span>
          <br />
        </Typography>
      ) : (
        <Typography>
          Đặt hàng của bạn không thành công. Vui lòng thử lại sau.
          <br />
          Nếu bạn có thắc mắc hoặc vấn đề về đơn hàng vui lòng liên hệ:
          <br />
          <span className="font-bold">1800 6236</span>
          <br />
        </Typography>
      )}

      <Divider sx={{ width: 1, borderStyle: 'dashed' }} />

      <Box gap={2} display="flex" flexWrap="wrap" justifyContent="center">
        <Button
          size="large"
          color="inherit"
          variant="outlined"
          onClick={handleReturn}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        >
          Tiếp tục mua hàng
        </Button>

        {vnp_ResponseCode === '00' && (
          <Button
            size="large"
            color="primary"
            variant="outlined"
            onClick={handleOrderList}
          >
            Danh sách đơn hàng
          </Button>
        )}
      </Box>
    </Box>
  );
}
