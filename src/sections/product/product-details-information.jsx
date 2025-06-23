import { Box, Grid, Typography } from '@mui/material';

export function ProductDetailsInformation({ productTypeAttributes, sx }) {
  return (
    <Box
      sx={{
        ...sx,
      }}
      className="py-5 px-6 bg-white rounded-lg shadow-sm"
    >
      <Grid container spacing={2}>
        {productTypeAttributes.length === 0 && (
          <Grid item xs={12} key="header" className="flex  items-center">
            <Typography
              variant="body1"
              className="mb-4 text-gray-800 font-semibold"
            >
              Thông tin đang được cập nhật...
            </Typography>
          </Grid>
        )}

        {productTypeAttributes.map((attribute) => (
          <Grid
            item
            xs={12}
            key={attribute.attributeId}
            className="flex justify-center items-center"
          >
            <Box className="w-1/5 m-0">
              <Typography className="text-gray-500 text-base text-wrap text-ellipsis overflow-hidden">
                {attribute.name}
              </Typography>
            </Box>

            <Box className="w-4/5">
              <Typography className="text-gray-800 text-base text-wrap text-ellipsis overflow-hidden">
                {attribute.value}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
