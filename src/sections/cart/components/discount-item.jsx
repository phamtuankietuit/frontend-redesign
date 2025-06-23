import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { fCurrency } from 'src/utils/format-number';
import { fDate, formatStr } from 'src/utils/format-time';

export function DiscountItem({
  discount,
  selected,
  disabled = false,
  shipping = false,
  onSelect,
}) {
  const getName = (voucherType) => {
    if (voucherType === 2) {
      return `PHÍ VẬN CHUYỂN`;
    }
    return `TRÊN ĐƠN HÀNG`;
  };

  const getValue = (value, voucherType) => {
    if (voucherType === 1) {
      return `${value}%`;
    }
    return `${value}đ`;
  };

  return (
    <Tooltip title={discount?.applyToProductTypeName}>
      <Stack
        direction="row"
        sx={{
          p: 1,
          borderRadius: 1.5,
          bgcolor: disabled ? 'grey.300' : 'white',
          width: 1,
          minWidth: 400,
        }}
        spacing={2}
        border={(theme) => `1px solid ${theme.palette.divider}`}
        borderColor={selected ? 'primary.main' : 'divider'}
      >
        <Box
          sx={{
            backgroundColor:
              discount?.voucherType === 2 ? 'info.main' : 'warning.main',
            borderRadius: 1.5,
            minWidth: 100,
            minHeight: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
          }}
        >
          <Iconify
            width={32}
            icon={
              discount?.voucherType === 2
                ? 'bxs:truck'
                : 'iconamoon:discount-fill'
            }
          />
        </Box>

        <Stack
          flexGrow={1}
          direction="row"
          justifyContent="space-between"
          spacing={1}
          width="100%"
        >
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
              {`GIẢM ${getValue(discount?.value, discount?.voucherType)} ${getName(discount?.voucherType)}`}
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
              {`Đơn hàng từ ${fCurrency(discount?.minimumSpend)}`}
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
              {`Giảm tối đa ${fCurrency(discount?.maximumDiscountValue)}`}
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
              {`${fDate(discount?.startTime, formatStr.myFormat.date)} - ${fDate(discount?.endTime, formatStr.myFormat.date)}`}
            </Typography>
          </Stack>

          {onSelect && !disabled && !selected && (
            <Button
              variant="outlined"
              size="small"
              color="warning"
              startIcon={<Iconify icon="solar:star-bold" />}
              onClick={onSelect}
            >
              Chọn
            </Button>
          )}
        </Stack>
      </Stack>
    </Tooltip>
  );
}
