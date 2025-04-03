import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Stack from '@mui/material/Stack';
import { Box, Tab, Card, Grid, Divider, Typography } from '@mui/material';

import { useTabs } from 'src/hooks/use-tabs';

import { selectProductType } from 'src/state/product-type/product-type.slice';
import { getProductTypesAsync } from 'src/services/product-type/product-type.service';
import {
  _appFeatured,
  _appFeaturedMini,
  _appFeaturedMini2,
  _ecommerceBestSalesman,
} from 'src/_mock';

import { Iconify } from 'src/components/iconify';
import { CustomTabs } from 'src/components/custom-tabs';
import { BackToTop } from 'src/components/animate/back-to-top';
import {
  ScrollProgress,
  useScrollProgress,
} from 'src/components/animate/scroll-progress';

import { ProductItem } from 'src/sections/product/product-item';
import { ProductList } from 'src/sections/product/product-list';
import { EcommerceBestSalesman } from 'src/sections/overview/e-commerce/ecommerce-best-salesman';

import { HomeFAQs } from '../../home/home-faqs';
import { AppFeatured } from '../../overview/app/app-featured';

// ----------------------------------------------------------------------

export function MyHomeView() {
  const dispatch = useDispatch();
  const {
    productTypes,
    homePage: { tabs },
  } = useSelector(selectProductType);

  const pageProgress = useScrollProgress();

  const customTabs = useTabs(tabs[0]?.value);

  useEffect(() => {
    if (productTypes.length === 0) {
      dispatch(getProductTypesAsync());
    }
  }, [dispatch, productTypes]);

  useEffect(() => {
    if (tabs.length > 0) {
      customTabs.setValue(tabs[0].value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, tabs]);

  const listProducts = [...Array(8)].map((_) => ({ ...product }));

  return (
    <>
      <ScrollProgress
        variant="linear"
        progress={pageProgress.scrollYProgress}
        sx={{ position: 'fixed' }}
      />

      <BackToTop />

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
          <Grid container spacing={1}>
            <Grid item xs={12} sm={8.2}>
              <AppFeatured list={_appFeatured} />
            </Grid>
            <Grid
              item
              sm={3.8}
              sx={{
                display: {
                  xs: 'none',
                  sm: 'block',
                },
              }}
            >
              <Box
                height={1}
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
              >
                <AppFeatured list={_appFeaturedMini} />
                <AppFeatured list={_appFeaturedMini2} />
              </Box>
            </Grid>
          </Grid>
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
                products={listProducts}
                isShowCart={false}
                isShowPagination={false}
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
                  products={listProducts}
                  isShowCart={false}
                  isShowPagination={false}
                />
              </Stack>
            </Card>
          )}

          <Card
            sx={{
              backgroundColor: '#85e19e',
              color: 'white',
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
                products={listProducts}
                isShowCart={false}
                isShowPagination={false}
              />
            </Stack>
          </Card>
        </Stack>

        <HomeFAQs />
      </Stack>
    </>
  );
}

const product = {
  id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
  gender: ['Men'],
  images: [
    'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-1.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-2.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-3.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-4.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-5.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-6.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-7.webp',
    'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-8.webp',
  ],
  reviews: [
    {
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
      name: 'Jayvion Simon',
      postedAt: '2025-04-02T11:06:03+00:00',
      comment:
        'The sun slowly set over the horizon, painting the sky in vibrant hues of orange and pink.',
      isPurchased: true,
      rating: 4.2,
      avatarUrl:
        'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-1.webp',
      helpful: 9911,
      attachments: [],
    },
    {
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
      name: 'Lucian Obrien',
      postedAt: '2025-04-01T10:06:03+00:00',
      comment:
        'She eagerly opened the gift, her eyes sparkling with excitement.',
      isPurchased: true,
      rating: 3.7,
      avatarUrl:
        'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-2.webp',
      helpful: 1947,
      attachments: [
        'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-1.webp',
      ],
    },
    {
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
      name: 'Deja Brady',
      postedAt: '2025-03-31T09:06:03+00:00',
      comment:
        'The old oak tree stood tall and majestic, its branches swaying gently in the breeze.',
      isPurchased: true,
      rating: 4.5,
      avatarUrl:
        'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-3.webp',
      helpful: 9124,
      attachments: [],
    },
    {
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
      name: 'Harrison Stein',
      postedAt: '2025-03-30T08:06:03+00:00',
      comment:
        'The aroma of freshly brewed coffee filled the air, awakening my senses.',
      isPurchased: false,
      rating: 3.5,
      avatarUrl:
        'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-4.webp',
      helpful: 6984,
      attachments: [
        'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-3.webp',
        'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-4.webp',
      ],
    },
    {
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5',
      name: 'Reece Chung',
      postedAt: '2025-03-29T07:06:03+00:00',
      comment:
        'The children giggled with joy as they ran through the sprinklers on a hot summer day.',
      isPurchased: false,
      rating: 0.5,
      avatarUrl:
        'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-5.webp',
      helpful: 8488,
      attachments: [],
    },
    {
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
      name: 'Lainey Davidson',
      postedAt: '2025-03-28T06:06:03+00:00',
      comment:
        'He carefully crafted a beautiful sculpture out of clay, his hands skillfully shaping the intricate details.',
      isPurchased: true,
      rating: 3,
      avatarUrl:
        'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-6.webp',
      helpful: 2034,
      attachments: [
        'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-6.webp',
        'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-7.webp',
        'https://api-prod-minimal-v700.pages.dev/assets/images/m-product/product-8.webp',
      ],
    },
    {
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
      name: 'Cristopher Cardenas',
      postedAt: '2025-03-27T05:06:03+00:00',
      comment:
        'The concert was a mesmerizing experience, with the music filling the venue and the crowd cheering in delight.',
      isPurchased: false,
      rating: 2.5,
      avatarUrl:
        'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-7.webp',
      helpful: 3364,
      attachments: [],
    },
    {
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
      name: 'Melanie Noble',
      postedAt: '2025-03-26T04:06:03+00:00',
      comment:
        'The waves crashed against the shore, creating a soothing symphony of sound.',
      isPurchased: false,
      rating: 2.8,
      avatarUrl:
        'https://api-prod-minimal-v700.pages.dev/assets/images/avatar/avatar-8.webp',
      helpful: 8401,
      attachments: [],
    },
  ],
  publish: 'published',
  ratings: [
    {
      name: '1 Star',
      starCount: 9911,
      reviewCount: 1947,
    },
    {
      name: '2 Star',
      starCount: 1947,
      reviewCount: 9124,
    },
    {
      name: '3 Star',
      starCount: 9124,
      reviewCount: 6984,
    },
    {
      name: '4 Star',
      starCount: 6984,
      reviewCount: 8488,
    },
    {
      name: '5 Star',
      starCount: 8488,
      reviewCount: 2034,
    },
  ],
  category: 'Shose',
  available: 72,
  priceSale: null,
  taxes: 10,
  quantity: 80,
  inventoryType: 'in stock',
  tags: ['Technology', 'Health and Wellness', 'Travel', 'Finance', 'Education'],
  code: '38BEE275',
  description:
    '\n<h6>Specifications</h6>\n<table>\n  <tbody>\n    <tr>\n      <td>Category</td>\n      <td>Mobile</td>\n    </tr>\n    <tr>\n      <td>Manufacturer</td>\n      <td>Apple</td>\n    </tr>\n    <tr>\n      <td>Warranty</td>\n      <td>12 Months</td>\n    </tr>\n    <tr>\n      <td>Serial number</td>\n      <td>358607726380311</td>\n    </tr>\n    <tr>\n      <td>Ships from</td>\n      <td>United States</td>\n    </tr>\n  </tbody>\n</table>\n\n<h6>Product details</h6>\n<ul>\n  <li>\n    <p>The foam sockliner feels soft and comfortable</p>\n  </li>\n  <li>\n    <p>Pull tab</p>\n  </li>\n  <li>\n    <p>Not intended for use as Personal Protective Equipment</p>\n  </li>\n  <li>\n    <p>Colour Shown: White/Black/Oxygen Purple/Action Grape</p>\n  </li>\n  <li>\n    <p>Style: 921826-109</p>\n  </li>\n  <li>\n    <p>Country/Region of Origin: China</p>\n  </li>\n</ul>\n<h6>Benefits</h6>\n<ul>\n  <li>\n    <p>Mesh and synthetic materials on the upper keep the fluid look of the OG while adding comfort</p>\n    and durability.\n  </li>\n  <li>\n    <p>Originally designed for performance running, the full-length Max Air unit adds soft, comfortable cushio</p>\n    ning underfoot.\n  </li>\n  <li>\n    <p>The foam midsole feels springy and soft.</p>\n  </li>\n  <li>\n    <p>The rubber outsole adds traction and durability.</p>\n  </li>\n</ul>\n<h6>Delivery and returns</h6>\n<p>Your order of $200 or more gets free standard delivery.</p>\n<ul>\n  <li>\n    <p>Standard delivered 4-5 Business Days</p>\n  </li>\n  <li>\n    <p>Express delivered 2-4 Business Days</p>\n  </li>\n</ul>\n<p>Orders are processed and delivered Monday-Friday (excluding public holidays)</p>\n\n',
  sku: 'WW75K5215YW/SV',
  createdAt: '2025-03-28T06:06:03+00:00',
  name: 'Hoa Học Trò',
  price: 128000,
  coverUrl:
    'https://cdn1.fahasa.com/media/catalog/product/z/6/z6423737315159-4125d5d0cf25c59d0.jpg',
  colors: ['#7F00FF'],
  totalRatings: 3,
  totalSold: 951,
  totalReviews: 3364,
  newLabel: {
    enabled: false,
    content: 'NEW',
  },
  saleLabel: {
    enabled: true,
    content: 'SALE',
  },
  sizes: [
    '6',
    '7',
    '8',
    '8.5',
    '9',
    '9.5',
    '10',
    '10.5',
    '11',
    '11.5',
    '12',
    '13',
  ],
  subDescription:
    'Featuring the original ripple design inspired by Japanese bullet trains, the Nike Air Max 97 lets you push your style full-speed ahead.',
};
