import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

// ----------------------------------------------------------------------

export function FormResendCode({
  value,
  disabled,
  onResendCode,
  sx,
  ...other
}) {
  return (
    <Box
      sx={{
        mt: 3,
        typography: 'body2',
        alignSelf: 'center',
        ...sx,
      }}
      {...other}
    >
      {`Chưa nhận được mã? `}
      <Link
        variant="subtitle2"
        onClick={onResendCode}
        sx={{
          cursor: 'pointer',
          ...(disabled && {
            color: 'text.disabled',
            pointerEvents: 'none',
          }),
        }}
      >
        Gửi lại {disabled && value && value > 0 && `(${value}s)`}
      </Link>
    </Box>
  );
}
