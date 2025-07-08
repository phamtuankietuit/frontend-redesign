import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { Box, Button, Divider, Typography } from '@mui/material';
import { paths } from 'src/routes/paths';
import OrderCompleteIllustration from 'src/assets/illustrations/order-complete-illustration';
import { Iconify } from 'src/components/iconify';
import MaintenanceIllustration from 'src/assets/illustrations/maintenance-illustration';
import { checkoutIPN } from 'src/services/checkout/checkout.service';

export function PlaceOrderStatusView() {
  const dispatch = useDispatch();

  const params = useSearchParams();

  // Lấy tất cả các params từ VNPay với useMemo để tránh re-render
  const vnpayParams = useMemo(
    () => ({
      vnp_TmnCode: params.get('vnp_TmnCode'),
      vnp_Amount: params.get('vnp_Amount')
        ? parseInt(params.get('vnp_Amount'), 10)
        : null,
      vnp_BankCode: params.get('vnp_BankCode'),
      vnp_BankTranNo: params.get('vnp_BankTranNo'),
      vnp_CardType: params.get('vnp_CardType'),
      vnp_PayDate: params.get('vnp_PayDate'),
      vnp_OrderInfo: params.get('vnp_OrderInfo'),
      vnp_TransactionNo: params.get('vnp_TransactionNo')
        ? parseInt(params.get('vnp_TransactionNo'), 10)
        : null,
      vnp_ResponseCode: params.get('vnp_ResponseCode'),
      vnp_TransactionStatus: params.get('vnp_TransactionStatus'),
      vnp_TxnRef: params.get('vnp_TxnRef'),
      vnp_SecureHashType: params.get('vnp_SecureHashType'),
      vnp_SecureHash: params.get('vnp_SecureHash'),
    }),
    [params],
  );

  const vnp_ResponseCode = vnpayParams.vnp_ResponseCode;

  // Log params để debug (có thể bỏ sau khi deploy)
  console.log('VNPay Params:', vnpayParams);

  const router = useRouter();

  const handleReturn = () => {
    router.replace(paths.product.root);
  };

  const handleOrderList = () => {
    router.push(paths.account.orders);
  };

  useEffect(() => {
    dispatch(checkoutIPN(vnpayParams));
  }, [vnp_ResponseCode, dispatch, vnpayParams]);

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
