import { Box, Button, Divider, Link, Typography } from '@mui/material';
import { paths } from 'src/routes/paths';
import { Iconify } from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import MaintenanceIllustration from 'src/assets/illustrations/maintenance-illustration';

export function PlaceOrderFailureView() {
  const router = useRouter();

  const handleReturn = () => {
    router.replace(paths.product.root);
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
      <Typography variant="h4">Đặt hàng thất bại!</Typography>

      <MaintenanceIllustration />

      <Typography>
        Đặt hàng của bạn không thành công. Vui lòng thử lại sau.
        <br />
        Nếu bạn có thắc mắc hoặc vấn đề về đơn hàng vui lòng liên hệ:
        <br />
        <span className="font-bold">1800 6236</span>
        <br />
      </Typography>

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
      </Box>
    </Box>
  );
}
