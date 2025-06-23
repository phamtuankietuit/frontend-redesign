import Stack from '@mui/material/Stack';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Divider, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import {
  ScrollProgress,
  useScrollProgress,
} from 'src/components/animate/scroll-progress';

import { Image } from 'src/components/image';
import { ProductList } from 'src/sections/product/product-list';
import { selectCampaign } from 'src/state/campaign/campaign.slice';
import { useEffect } from 'react';
import { getProductsCampaignAsync } from 'src/services/product/product.service';
import { MyCarousel } from 'src/components/my-carousel/my-carousel';
import { _coursesFeatured } from 'src/_mock';
import { getPromotionsAsync } from 'src/services/promotion/promotion.service';

// ----------------------------------------------------------------------

export function CampaignView() {
  const pageProgress = useScrollProgress();

  const dispatch = useDispatch();

  const {
    banner,
    products,
    productsLoading,
    productsTableFilters,
    promotions,
  } = useSelector(selectCampaign);

  useEffect(() => {
    if (banner) {
      dispatch(
        getProductsCampaignAsync({
          ...productsTableFilters,
          productTypeIds: [banner.productTypeId],
        }),
      );

      dispatch(
        getPromotionsAsync({
          pageNumber: 1,
          pageSize: 20,
          applyToProductTypeId: banner.productTypeId,
        }),
      );
    }
  }, [banner, dispatch, productsTableFilters]);

  return (
    <>
      <ScrollProgress
        variant="linear"
        progress={pageProgress.scrollYProgress}
        sx={{ position: 'fixed' }}
      />

      <Stack
        sx={{ position: 'relative', mt: 2, bgcolor: 'background.default' }}
        spacing={3}
      >
        <Stack
          sx={{
            mx: {
              xs: 1,
              sm: 3,
              md: 8,
              lg: 20,
            },
          }}
          spacing={3}
        >
          <Image
            alt="campaign-img"
            src={banner?.imageUrl}
            sx={{
              width: 1,
              height: 1,
            }}
          />
        </Stack>

        <Stack
          sx={{
            backgroundColor: 'warning.lighter',
            py: 4,
          }}
          spacing={3}
        >
          <MyCarousel
            title="CÁC CHƯƠNG TRÌNH KHUYẾN MÃI ĐANG ÁP DỤNG"
            list={promotions}
            sx={{
              mt: 5,
              p: 2,
              borderRadius: 1.5,
              boxShadow: 1,
              mx: {
                xs: 1,
                sm: 3,
                md: 8,
                lg: 20,
              },
              backgroundColor: '#85e19e',
            }}
          />

          <Card
            sx={{
              backgroundColor: 'warning.light',
              mx: {
                xs: 1,
                sm: 3,
                md: 8,
                lg: 20,
              },
              color: 'warning.darker',
            }}
          >
            <Stack direction="row" spacing={1} sx={{ p: 2 }}>
              <Iconify
                icon="lsicon:badge-promotion-filled"
                width={28}
                sx={{ color: 'warning.dark' }}
              />
              <Typography variant="h6">
                SẢN PHẨM THUỘC CHƯƠNG TRÌNH KHUYẾN MÃI
              </Typography>
            </Stack>

            <Divider sx={{ backgroundColor: 'warning.main' }} />

            <Stack spacing={3} sx={{ p: 2 }}>
              <ProductList products={products} loading={productsLoading} />
            </Stack>
          </Card>
        </Stack>
      </Stack>
    </>
  );
}
