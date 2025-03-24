import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export function AddressItem({ address, action, sx, ...other }) {
  return (
    <Paper
      sx={{
        gap: 2,
        display: 'flex',
        position: 'relative',
        alignItems: { md: 'flex-end' },
        flexDirection: { xs: 'column', md: 'row' },
        ...sx,
      }}
      {...other}
    >
      <Stack flexGrow={1} spacing={1}>
        <Stack direction="row" alignItems="center">
          <Typography variant="subtitle2">
            {address.receiverName}
            <Box
              component="span"
              sx={{ ml: 0.5, typography: 'body2', color: 'text.secondary' }}
            >
              {address.type === 1 ? '(Nhà ở)' : '(Văn phòng)'}
            </Box>
          </Typography>

          {address.isDefault && (
            <Label color="info" sx={{ ml: 1 }}>
              Mặc định
            </Label>
          )}
        </Stack>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {address.detailAddress}, {address.communeName}, {address.districtName}
          , {address.provinceName}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {address.phoneNumber}
        </Typography>
      </Stack>

      {action && action}
    </Paper>
  );
}
