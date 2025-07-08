import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import {
  Carousel,
  useCarousel,
  CarouselArrowBasicButtons,
} from 'src/components/carousel';
import { Stack } from '@mui/material';
import { fCurrency } from 'src/utils/format-number';
import { fDate, formatStr } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export function MyCarousel({ title, list, sx, ...other }) {
  const carousel = useCarousel({
    align: 'start',
    slideSpacing: '24px',
    slidesToShow: { xs: 1, sm: 2, md: 3, lg: '40%', xl: '30%' },
  });

  return (
    <Box sx={sx} {...other}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>
          {title}
        </Typography>

        <CarouselArrowBasicButtons {...carousel.arrows} />
      </Box>

      <Carousel
        carousel={carousel}
        slotProps={{
          slide: { py: 3 },
        }}
        sx={{ px: 0.5 }}
      >
        {list?.map((item, index) => (
          <CarouselItem
            sx={{
              border: (theme) => `1px solid ${theme.palette.divider}`,
              boxShadow: 1,
            }}
            key={item.id}
            item={item}
            index={index}
          />
        ))}
      </Carousel>
    </Box>
  );
}

// ----------------------------------------------------------------------

function CarouselItem({ item, sx, index, ...other }) {
  const renderImage = (
    // <Box
    //   sx={{
    //     px: 1,
    //     pt: 1,
    //   }}
    // >
    <Box
      sx={{
        px: 1,
        pt: 1,
      }}
    >
      <Box
        sx={{
          backgroundColor:
            item?.voucherType === 2 ? 'info.main' : 'warning.main',
          borderRadius: 1.5,
          width: '100%',
          height: '128px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          px: 1,
        }}
      >
        <Iconify
          width={72}
          icon={
            item?.voucherType === 2 ? 'bxs:truck' : 'iconamoon:discount-fill'
          }
        />
      </Box>
    </Box>
  );

  return (
    <Card sx={{ width: 1, ...sx }} {...other}>
      {renderImage}

      <Stack sx={{ p: 2 }}>
        <Typography variant="subtitle1" color="inherit">
          {item?.name}
        </Typography>
        <Typography variant="subtitle2" color="grey.600">
          {`Đơn hàng từ ${fCurrency(item?.minimumSpend)}`}
        </Typography>
        <Typography variant="subtitle2" color="grey.500">
          {`${fDate(item?.startTime, formatStr.myFormat.date)} - ${fDate(item?.endTime, formatStr.myFormat.date)}`}
        </Typography>
      </Stack>
    </Card>
  );
}
