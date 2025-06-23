import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';

import { Iconify } from 'src/components/iconify';
import { backStep, selectCart } from 'src/state/cart/cart.slice';

// ----------------------------------------------------------------------

export function CheckoutBillingInfo({ billing, onBackStep, sx, ...other }) {
  const dispatch = useDispatch();

  const { addressSelected } = useSelector(selectCart);

  const handleBackStep = () => {
    dispatch(backStep());
  };

  return (
    <Card sx={{ mb: 3, ...sx }} {...other}>
      <CardHeader
        title="Địa chỉ"
        action={
          <Button
            size="small"
            startIcon={<Iconify icon="solar:pen-bold" />}
            onClick={handleBackStep}
          >
            Sửa
          </Button>
        }
      />
      <Stack spacing={1} sx={{ p: 3 }}>
        <Box sx={{ typography: 'subtitle2' }}>
          {`${addressSelected?.receiverName} `}
          <Box
            component="span"
            sx={{ color: 'text.secondary', typography: 'body2' }}
          >
            ({addressSelected?.type === 2 ? 'Văn phòng' : 'Nhà ở '})
          </Box>
        </Box>

        <Box sx={{ color: 'text.secondary', typography: 'body2' }}>
          {addressSelected?.detailAddress}, {addressSelected?.communeName},{' '}
          {addressSelected?.districtName}, {addressSelected?.provinceName}
        </Box>

        <Box sx={{ color: 'text.secondary', typography: 'body2' }}>
          {addressSelected?.phoneNumber}
        </Box>
      </Stack>
    </Card>
  );
}
