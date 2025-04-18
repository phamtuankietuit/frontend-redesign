import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import { Rating } from '@mui/material';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import {
  fCurrency,
  fMyShortenNumber,
  fShortenNumber,
} from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';
import { ColorPreview } from 'src/components/color-utils';
import { Logo } from 'src/components/logo';
import { useCheckoutContext } from '../checkout/context';

// ----------------------------------------------------------------------

export function ProductItem({ product, isShowCart = true }) {
  const checkout = useCheckoutContext();

  const {
    id,
    name,
    thumbnailImageUrl,
    price,
    colors,
    available,
    sizes,
    totalStockQuantity,
    minUnitPrice,
    minRecommendedRetailPrice,
    averageRating,
    priceSale,
    newLabel,
    saleLabel,
    totalRatings,
    totalReviews,
  } = product;

  const linkTo = paths.product.details(id);

  const handleAddCart = async () => {
    const newProduct = {
      id,
      name,
      thumbnailImageUrl,
      available,
      price,
      colors: [colors[0]],
      size: sizes[0],
      quantity: 1,
    };
    try {
      checkout.onAddToCart(newProduct);
    } catch (error) {
      console.error(error);
    }
  };

  // const renderLabels = (newLabel.enabled || saleLabel.enabled) && (
  //   <Stack
  //     direction="row"
  //     alignItems="center"
  //     spacing={1}
  //     sx={{
  //       position: 'absolute',
  //       zIndex: 9,
  //       top: 16,
  //       right: 16,
  //     }}
  //   >
  //     {newLabel.enabled && (
  //       <Label variant="filled" color="info">
  //         {newLabel.content}
  //       </Label>
  //     )}
  //     {saleLabel.enabled && (
  //       <Label variant="filled" color="error">
  //         {saleLabel.content}
  //       </Label>
  //     )}
  //   </Stack>
  // );

  const renderImg = (
    <Box sx={{ position: 'relative', p: 1 }}>
      {!!totalStockQuantity && isShowCart && (
        <Fab
          color="warning"
          size="medium"
          className="add-cart-btn"
          onClick={handleAddCart}
          sx={{
            right: 16,
            bottom: 16,
            zIndex: 9,
            opacity: 0,
            position: 'absolute',
            transition: (theme) =>
              theme.transitions.create('all', {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.shorter,
              }),
          }}
        >
          <Iconify icon="solar:cart-plus-bold" width={24} />
        </Fab>
      )}

      <Tooltip title={!totalStockQuantity && 'Hết hàng'} placement="bottom-end">
        <Image
          alt={name}
          src={thumbnailImageUrl || '/logo/my-logo-single.png'}
          ratio="1/1"
          sx={{
            borderRadius: 1.5,
            ...(!totalStockQuantity && {
              opacity: 0.48,
              filter: 'grayscale(1)',
            }),
          }}
        />
      </Tooltip>
    </Box>
  );

  const renderContent = (
    <Stack spacing={1} sx={{ p: 3, pt: 2 }}>
      <Link
        component={RouterLink}
        href={linkTo}
        color="inherit"
        variant="subtitle2"
        noWrap
      >
        {name}
      </Link>

      <Stack direction="column" justifyContent="space-between" spacing={1}>
        <Stack
          direction="row"
          alignItems="center"
          sx={{ color: 'text.disabled', typography: 'body2' }}
        >
          <Rating
            size="small"
            value={4.5}
            precision={0.1}
            readOnly
            sx={{ mr: 1 }}
          />
          {`(${fMyShortenNumber(32000)})`}
        </Stack>

        <Stack direction="row" spacing={0.5} sx={{ typography: 'subtitle1' }}>
          {!!minUnitPrice && (
            <Box
              component="span"
              sx={{ color: 'text.disabled', textDecoration: 'line-through' }}
            >
              {fCurrency(minUnitPrice)}
            </Box>
          )}

          <Box component="span">{fCurrency(minRecommendedRetailPrice)}</Box>
        </Stack>
      </Stack>
    </Stack>
  );

  return (
    <Card sx={{ '&:hover .add-cart-btn': { opacity: 1 } }}>
      {/* {renderLabels} */}

      {renderImg}

      {renderContent}
    </Card>
  );
}
