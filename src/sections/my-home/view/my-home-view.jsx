import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Stack from '@mui/material/Stack';
import { Box, Tab, Card, Grid, Divider, Typography } from '@mui/material';

import { useTabs } from 'src/hooks/use-tabs';

import { selectProductType } from 'src/state/product-type/product-type.slice';
import { getProductTypesAsync } from 'src/services/product-type/product-type.service';
import { _appFeatured, _ecommerceBestSalesman } from 'src/_mock';

import { Iconify } from 'src/components/iconify';
import { CustomTabs } from 'src/components/custom-tabs';
import {
  ScrollProgress,
  useScrollProgress,
} from 'src/components/animate/scroll-progress';

import { selectCampaign } from 'src/state/campaign/campaign.slice';
import { selectHome } from 'src/state/home/home.slice';
import { getBannersAsync } from 'src/services/banner/banner.service';
import {
  getProductsAsync,
  getProductsTopSellingMonthlyAsync,
  getProductsTopSellingWeeklyAsync,
  getProductsTrendyAsync,
} from 'src/services/product/product.service';
import { ProductList } from 'src/sections/product/product-list';
import { EcommerceBestSalesman } from 'src/sections/overview/e-commerce/ecommerce-best-salesman';

import { HomeFAQs } from '../../home/home-faqs';
import { AppFeatured } from '../../overview/app/app-featured';

// ----------------------------------------------------------------------

export function MyHomeView() {
  const dispatch = useDispatch();
  const {
    homePage: { tabs },
  } = useSelector(selectProductType);

  const { banners } = useSelector(selectCampaign);

  const { trendy, trendyLoading, homeProducts, homeProductsLoading } =
    useSelector(selectHome);

  const pageProgress = useScrollProgress();

  const customTabs = useTabs(tabs[0]?.value);

  useEffect(() => {
    dispatch(getProductTypesAsync());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getBannersAsync({ pageNumber: 1, pageSize: 100 }));
    dispatch(getProductsTrendyAsync());
    dispatch(getProductsTopSellingWeeklyAsync());
    dispatch(getProductsTopSellingMonthlyAsync({ Limit: 5 }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      getProductsAsync({
        pageNumber: 1,
        pageSize: 10,
        productTypeIds: [customTabs.value],
      }),
    );
  }, [customTabs.value, dispatch]);

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
          <AppFeatured list={banners} />
        </Stack>

        <Stack
          sx={{
            backgroundColor: '#fccfcf',
            py: 4,
          }}
          spacing={3}
        >
          <Card
            sx={{
              backgroundColor: '#ff9696',
              mx: {
                xs: 1,
                sm: 3,
                md: 8,
                lg: 20,
              },
              color: 'white',
            }}
          >
            <Stack direction="row" spacing={1} sx={{ p: 2 }}>
              <Iconify
                icon="eva:trending-up-fill"
                width={28}
                sx={{ color: '#b23a33' }}
              />
              <Typography variant="h6">XU HƯỚNG MUA SẮM</Typography>
            </Stack>

            <Divider sx={{ backgroundColor: '#ff5449' }} />

            <Stack spacing={3} sx={{ p: 2 }}>
              <ProductList
                products={trendy}
                isShowCart={false}
                isShowPagination={false}
                loading={trendyLoading}
              />
            </Stack>
          </Card>
        </Stack>

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
          <EcommerceBestSalesman
            title="Sản phẩm bán chạy nhất"
            tableData={_ecommerceBestSalesman}
            headLabel={[
              { id: 'name', label: 'Sản phẩm', align: 'left' },
              { id: 'totalAmount', label: 'Lượt bán', align: 'center' },
              { id: 'rank', label: 'Thứ hạng', align: 'center' },
            ]}
          />

          {tabs.length > 0 && (
            <Card
              sx={{
                backgroundColor: '#ffd8a8',
                color: 'white',
              }}
            >
              <CustomTabs
                value={customTabs.value}
                onChange={customTabs.onChange}
                variant="scrollable"
                sx={{
                  backgroundColor: '#ffd8a8',
                  color: '#ccac86',
                  p: 1,
                }}
              >
                {tabs?.map((tab) => (
                  <Tab
                    sx={{ color: '#b29775' }}
                    key={tab.value}
                    value={tab.value}
                    label={tab.label}
                  />
                ))}
              </CustomTabs>

              <Divider sx={{ backgroundColor: '#fff' }} />

              <Stack spacing={3} sx={{ p: 2 }}>
                <ProductList
                  products={homeProducts}
                  isShowCart={false}
                  isShowPagination={false}
                  loading={homeProductsLoading}
                />
              </Stack>
            </Card>
          )}
        </Stack>

        <HomeFAQs />
      </Stack>
    </>
  );
}
