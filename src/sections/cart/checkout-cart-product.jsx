import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { paths } from 'src/routes/paths';

import { fCurrency } from 'src/utils/format-number';

import { Button, Checkbox, Link, Tooltip } from '@mui/material';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { IncrementerButton } from '../product/components/incrementer-button';

// ----------------------------------------------------------------------

export function CheckoutCartProduct({
  row,
  selected,
  onSelectRow,
  onDelete,
  onIncrease,
  onDecrease,
  onPopoverOpen,
}) {
  return (
    <Tooltip
      title={row?.totalQuantity <= 0 ? 'Sản phẩm đã hết hàng' : ''}
      placement="right"
    >
      <TableRow
        hover
        selected={selected}
        aria-checked={selected}
        tabIndex={-1}
        sx={{
          bgcolor: row?.totalQuantity <= 0 && 'grey.300',
        }}
      >
        <TableCell padding="checkbox">
          <Checkbox
            id={String(row.id)}
            checked={selected}
            onClick={onSelectRow}
            disabled={row?.totalQuantity <= 0}
          />
        </TableCell>

        <TableCell>
          <Stack
            spacing={2}
            direction="row"
            alignItems="center"
            sx={{ maxWidth: 240 }}
          >
            <Avatar
              variant="rounded"
              alt={row?.productName}
              src={row?.imageUrl}
              sx={{ width: 64, height: 64 }}
            />

            <Stack spacing={0.5}>
              <Tooltip title={row?.productName} placement="bottom">
                <Link
                  href={paths.product.details(row?.productId)}
                  variant="subtitle2"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: 200,
                    color: 'text.primary',
                  }}
                >
                  {row?.productName}
                </Link>
              </Tooltip>

              {row?.productVariantName && (
                <Stack
                  direction="column"
                  sx={{ typography: 'body2', color: 'text.secondary' }}
                  spacing={0.5}
                >
                  Phân loại:
                  <Label
                    sx={{
                      width: 'fit-content',
                    }}
                  >
                    {row?.productVariantName}
                  </Label>
                  <Button
                    component="span"
                    size="small"
                    endIcon={<Iconify icon="iconamoon:arrow-down-2" />}
                    variant="outlined"
                    onClick={onPopoverOpen}
                  >
                    Chọn phân loại
                  </Button>
                </Stack>
              )}
            </Stack>
          </Stack>
        </TableCell>

        <TableCell>
          <Stack>
            <Box
              component="span"
              sx={{
                color: 'text.disabled',
                textDecoration: 'line-through',
              }}
            >
              {fCurrency(row?.recommendedRetailPrice)}
            </Box>
            {fCurrency(row?.unitPrice)}
          </Stack>
        </TableCell>

        <TableCell>
          <Box sx={{ width: 88, textAlign: 'right' }}>
            <IncrementerButton
              quantity={row.quantity}
              onDecrease={onDecrease}
              onIncrease={onIncrease}
              disabledDecrease={row.quantity <= 1 || row.totalQuantity <= 0}
              disabledIncrease={row.quantity >= row.totalQuantity}
            />

            <Typography
              variant="caption"
              component="div"
              sx={{ color: 'text.secondary', mt: 1 }}
            >
              kho: {row.totalQuantity}
            </Typography>
          </Box>
        </TableCell>

        <TableCell align="right">
          {fCurrency(row.unitPrice * row.quantity)}
        </TableCell>

        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton onClick={onDelete} color="error">
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </TableCell>
      </TableRow>
    </Tooltip>
  );
}
