import Autoplay from 'embla-carousel-autoplay';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';

import { Image } from 'src/components/image';
import {
  Carousel,
  useCarousel,
  CarouselDotButtons,
  CarouselArrowBasicButtons,
} from 'src/components/carousel';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export function AppFeatured({ list, sx, ...other }) {
  const carousel = useCarousel({ loop: true }, [
    Autoplay({ playOnInit: true, delay: 8000 }),
  ]);

  return (
    <Card sx={{ bgcolor: 'common.black', ...sx }} {...other}>
      <CarouselDotButtons
        scrollSnaps={carousel.dots.scrollSnaps}
        selectedIndex={carousel.dots.selectedIndex}
        onClickDot={carousel.dots.onClickDot}
        sx={{ top: 16, left: 16, position: 'absolute', color: 'primary.light' }}
      />

      <CarouselArrowBasicButtons
        {...carousel.arrows}
        options={carousel.options}
        sx={{ top: 8, right: 8, position: 'absolute', color: 'common.white' }}
      />

      <Carousel carousel={carousel}>
        {list.map((item) => (
          <CarouselItem key={item.id} item={item} />
        ))}
      </Carousel>
    </Card>
  );
}

// ----------------------------------------------------------------------

function CarouselItem({ item, ...other }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(paths.campaign.root(item.id));
  };

  return (
    <Box sx={{ width: 1, position: 'relative', ...other }}>
      <Image
        alt={item.title}
        src={item.imageUrl}
        sx={{
          width: 1,
          height: 1,
          cursor: 'pointer',
        }}
        onClick={handleClick}
      />
    </Box>
  );
}
