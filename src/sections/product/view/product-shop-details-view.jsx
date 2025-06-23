import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'src/routes/hooks';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';

import { RouterLink } from 'src/routes/components';

import { useTabs } from 'src/hooks/use-tabs';

import { varAlpha } from 'src/theme/styles';
import { _coursesFeatured } from 'src/_mock';
import { selectProduct } from 'src/state/product/product.slice';
import { getProductTypeByIdAsync } from 'src/services/product-type/product-type.service';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { MyCarousel } from 'src/components/my-carousel/my-carousel';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useCheckoutContext } from 'src/sections/checkout/context';
import { Divider, Stack, Typography } from '@mui/material';

import {
  getProductRatingsAsync,
  getProductRecommendationsAsync,
} from 'src/services/product/product.service';
import { ProductDetailsSkeleton } from '../product-skeleton';
import { ProductDetailsReview } from '../product-details-review';
import { ProductDetailsSummary } from '../product-details-summary';
import { ProductDetailsCarousel } from '../product-details-carousel';
import { ProductDetailsDescription } from '../product-details-description';
import { ProductDetailsInformation } from '../product-details-information';
import { ProductList } from '../product-list';

export function ProductShopDetailsView({ product, error, loading }) {
  const { id = '' } = useParams();

  const dispatch = useDispatch();

  const {
    productTypesBreadcrumb,
    ratings,
    productsRelated,
    productsRelatedLoading,
  } = useSelector(selectProduct);

  const checkout = useCheckoutContext();

  const tabs = useTabs('information');

  useEffect(() => {
    if (product) {
      dispatch(
        getProductTypeByIdAsync({
          id: product.productTypeId,
          params: { withParent: true },
        }),
      );

      dispatch(
        getProductRatingsAsync({
          productId: product.id,
          pageSize: 10,
          pageNumber: 1,
        }),
      );
    }
  }, [dispatch, product]);

  useEffect(() => {
    dispatch(getProductRecommendationsAsync(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <Container sx={{ mt: 5, mb: 10 }}>
        <ProductDetailsSkeleton />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 5, mb: 10 }}>
        <EmptyContent
          filled
          title="Không tìm thấy sản phẩm!"
          action={
            <Button
              component={RouterLink}
              href="/"
              startIcon={<Iconify width={16} icon="eva:arrow-ios-back-fill" />}
              sx={{ mt: 3 }}
            >
              Trở về danh sách
            </Button>
          }
          sx={{ py: 10 }}
        />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 5, mb: 10 }}>
      <CustomBreadcrumbs
        links={[
          { name: 'Trang chủ', href: '/' },
          ...productTypesBreadcrumb,
          { name: product?.name || 'Sản phẩm' },
        ]}
        sx={{ mb: 5 }}
      />

      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid xs={12} md={6} lg={7}>
          <ProductDetailsCarousel images={product?.largeImageUrls} />
        </Grid>

        <Grid xs={12} md={6} lg={5}>
          {product && (
            <ProductDetailsSummary
              product={product}
              items={checkout.items}
              onAddCart={checkout.onAddToCart}
              onGotoStep={checkout.onGotoStep}
              // disableActions={!product?.available}
            />
          )}
        </Grid>
      </Grid>

      {/* <MyCarousel
        title="Khuyến mãi và Mã giảm giá vận chuyển"
        list={_coursesFeatured}
        sx={{
          mt: 5,
          bgcolor: (theme) =>
            theme.palette.mode === 'light' ? 'white' : 'grey.800',
          p: 2,
          borderRadius: 1.5,
          boxShadow: 1,
        }}
      /> */}

      <Card sx={{ mt: 5 }}>
        <Tabs
          value={tabs.value}
          onChange={tabs.onChange}
          sx={{
            px: 3,
            boxShadow: (theme) =>
              `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
          }}
        >
          {[
            { value: 'information', label: 'Thông tin sản phẩm' },
            { value: 'description', label: 'Mô tả sản phẩm' },
            {
              value: 'reviews',
              label: ratings?.totalRating
                ? `Đánh giá (${ratings.totalRating})`
                : 'Đánh giá',
            },
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {tabs.value === 'information' && (
          <ProductDetailsInformation
            productTypeAttributes={product?.productTypeAttributes}
          />
        )}

        {tabs.value === 'description' && (
          <ProductDetailsDescription description={product?.description} />
        )}

        {tabs.value === 'reviews' && <ProductDetailsReview />}
      </Card>

      <Card
        sx={{
          backgroundColor: '#85e19e',
          color: 'white',
          mt: 5,
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{ p: 2, justifyContent: 'center' }}
        >
          <Iconify
            icon="solar:magic-stick-bold-duotone"
            width={28}
            sx={{ color: '#fff600' }}
          />
          <Typography variant="h6">GỢI Ý CHO BẠN</Typography>
        </Stack>

        <Divider sx={{ backgroundColor: '#fff' }} />

        <Stack spacing={3} sx={{ p: 2 }}>
          <ProductList
            products={productsRelated}
            loading={productsRelatedLoading || loading}
            isShowPagination={false}
          />
        </Stack>
      </Card>
    </Container>
  );
}
