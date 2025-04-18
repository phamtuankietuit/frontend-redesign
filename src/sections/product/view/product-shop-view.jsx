import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import {
  Box,
  Card,
  Grid,
  Chip,
  Radio,
  Divider,
  TextField,
  RadioGroup,
  Autocomplete,
  FormControlLabel,
} from '@mui/material';

import { updateURLParams } from 'src/utils/params-helper';

import { PRODUCT_SORT_OPTIONS } from 'src/_mock';
import { getProductsAsync } from 'src/services/product/product.service';
import { selectProductType } from 'src/state/product-type/product-type.slice';
import {
  selectProduct,
  setCatalogTableFilters,
} from 'src/state/product/product.slice';
import {
  getProductTypeByIdAsync,
  getProductTypesFlattenAsync,
  getProductTypeAttributesAsync,
} from 'src/services/product-type/product-type.service';

import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProductList } from '../product-list';
import { ProductSort } from '../product-sort';
import { CartIcon } from '../components/cart-icon';
import { useCheckoutContext } from '../../checkout/context';

// ----------------------------------------------------------------------

export const PRICE_OPTIONS = [
  { label: 'Tất cả', value: { min: 0, max: 999999999 } },
  { label: '0đ - 150.000đ', value: { min: 0, max: 150000 } },
  { label: '150.000đ - 300.000đ', value: { min: 150000, max: 300000 } },
  { label: '300.000đ - 500.000đ', value: { min: 300000, max: 500000 } },
  { label: '500.000đ - 700.000đ', value: { min: 500000, max: 700000 } },
  { label: '700.000đ - Trở lên', value: { min: 700000, max: 999999999 } },
];

const RecursiveTreeItem = ({ item, allItems }) => {
  const children = allItems?.filter(
    (child) => child.parentProductTypeId === item.id,
  );

  return (
    <TreeItem itemId={String(item.id)} label={item.displayName || ''}>
      {children?.length > 0 &&
        children.map((childItem) => (
          <RecursiveTreeItem
            key={childItem.id}
            item={childItem}
            allItems={allItems}
          />
        ))}
    </TreeItem>
  );
};

export function ProductShopView() {
  const dispatch = useDispatch();

  const [searchParams, setSearchParams] = useSearchParams();

  const productTypeId = searchParams.get('productTypeId');
  const pageNumber = searchParams.get('pageNumber') || 1;
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const sortBy = searchParams.get('sortBy');
  const sortDirection = searchParams.get('sortDirection');

  // const { user } = useSelector(selectAuth);

  const {
    catalogPage: { products, tableFilters, loading, error, totalPages },
  } = useSelector(selectProduct);

  const {
    productTypesFlatten,
    catalogPage: { productTypeList, listAttributes },
  } = useSelector(selectProductType);
  console.log('🚀 ~ ProductShopView ~ listAttributes:', listAttributes);

  const checkout = useCheckoutContext();

  const productsEmpty = (products.length === 0 && !loading) || error;

  const [expandedItems, setExpandedItems] = useState(['all']);

  const listBreadcrumbs = useMemo(
    () => [
      { name: 'Tất cả', href: '/products' },
      ...productTypeList.map((item) => ({
        name: item.displayName,
        href: `/products?productTypeId=${item.id}`,
      })),
    ],
    [productTypeList],
  );

  const handleSortBy = (newValue) => {
    const newParams = new URLSearchParams(searchParams.toString());
    switch (newValue) {
      case 'CreationTime':
        dispatch(
          setCatalogTableFilters({
            pageNumber: 1,
            sortBy: newValue,
            sortDirection: 'desc',
          }),
        );
        newParams.set('sortBy', 'CreationTime');
        newParams.set('sortDirection', 'desc');
        break;
      case 'NameDesc':
        dispatch(
          setCatalogTableFilters({
            pageNumber: 1,
            sortBy: 'Name',
            sortDirection: 'desc',
          }),
        );
        newParams.set('sortBy', 'Name');
        newParams.set('sortDirection', 'desc');
        break;
      case 'NameAsc':
        dispatch(
          setCatalogTableFilters({
            pageNumber: 1,
            sortBy: 'Name',
            sortDirection: 'asc',
          }),
        );
        newParams.set('sortBy', 'Name');
        newParams.set('sortDirection', 'asc');
        break;
      default: {
        break;
      }
    }
    newParams.set('pageNumber', 1);
    setSearchParams(newParams);
  };

  const handleSelectedTreeView = (event, itemIds) => {
    if (itemIds !== 'all') {
      // Sử dụng hàm tiện ích updateURLParams
      const newParams = updateURLParams(searchParams, {
        productTypeId: itemIds,
        pageNumber: 1,
      });
      setSearchParams(newParams);
    } else {
      // Sử dụng hàm tiện ích updateURLParams
      const newParams = updateURLParams(searchParams, { pageNumber: 1 }, [
        'productTypeId',
      ]);
      setSearchParams(newParams);
      setExpandedItems(['all']);
    }
  };

  const handlePageChange = (event, newPage) => {
    dispatch(setCatalogTableFilters({ pageNumber: newPage }));

    const newParams = updateURLParams(searchParams, { pageNumber: newPage });
    setSearchParams(newParams);
  };

  const handlePriceFilterChange = (e, value) => {
    const [min, max] = value.split(',').map((item) => Number(item));

    // Sử dụng hàm tiện ích updateURLParams
    const newParams = updateURLParams(searchParams, {
      pageNumber: 1,
      minPrice: min,
      maxPrice: max,
    });
    setSearchParams(newParams);

    dispatch(
      setCatalogTableFilters({
        pageNumber: 1,
        minPrice: min,
        maxPrice: max,
      }),
    );
  };

  useEffect(() => {
    setExpandedItems([
      'all',
      ...productTypeList.map((item) => String(item.id)),
    ]);
  }, [productTypeList]);

  useEffect(() => {
    dispatch(getProductsAsync(tableFilters));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableFilters]);

  const fetchData = useCallback(() => {
    if (productTypeId !== null) {
      dispatch(
        getProductTypeByIdAsync({
          id: productTypeId,
          params: {
            withParent: true,
          },
        }),
      );

      dispatch(getProductTypeAttributesAsync(productTypeId));

      dispatch(
        setCatalogTableFilters({
          pageNumber: pageNumber ? Number(pageNumber) : 1,
          productTypeIds: productTypeId,
          sortBy,
          sortDirection,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
        }),
      );
    } else {
      dispatch(
        setCatalogTableFilters({
          pageNumber: pageNumber ? Number(pageNumber) : 1,
          productTypeIds: undefined,
          sortBy,
          sortDirection,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
        }),
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productTypeId]);

  useEffect(() => {
    fetchData();
    dispatch(getProductTypesFlattenAsync());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData]);

  const renderFilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-end', sm: 'center' }}
      direction={{ xs: 'column', sm: 'row' }}
    >
      <Stack direction="row" spacing={1} flexShrink={0}>
        <ProductSort
          sort={tableFilters.sortBy}
          onSort={handleSortBy}
          sortOptions={PRODUCT_SORT_OPTIONS}
        />
      </Stack>
    </Stack>
  );

  const renderNotFound = (
    <EmptyContent
      sx={{ height: 'fit-content', py: 10 }}
      title="Không tìm thấy dữ liệu"
    />
  );

  return (
    <Container sx={{ mb: 15 }}>
      <CartIcon totalItems={checkout.totalItems} />
      {/* {user && <ChatIcon />} */}

      <Stack
        direction="row"
        spacing={2.5}
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          my: { xs: 1, md: 3 },
        }}
      >
        <CustomBreadcrumbs
          links={[{ name: 'Trang chủ', href: '/' }, ...listBreadcrumbs]}
        />

        {renderFilters}
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: 'fit-content', p: 2 }}>
            <Stack spacing={1} divider={<Divider />}>
              {/* CATEGORY */}
              <Box key="category" display="flex" flexDirection="column">
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Danh mục sản phẩm
                </Typography>

                <SimpleTreeView
                  sx={{ overflowX: 'hidden', width: 1 }}
                  selectedItems={[productTypeId || 'all']}
                  onSelectedItemsChange={handleSelectedTreeView}
                  expandedItems={['all', ...expandedItems]}
                  expansionTrigger="iconContainer"
                  slotProps={{
                    collapseIcon: {
                      sx: { display: 'none' },
                    },
                  }}
                >
                  <TreeItem itemId="all" label="Tất cả">
                    {productTypesFlatten
                      ?.filter(
                        (productType) => !productType.parentProductTypeId,
                      )
                      .map((productType) => (
                        <RecursiveTreeItem
                          key={productType.id}
                          item={productType}
                          allItems={productTypesFlatten}
                        />
                      ))}
                  </TreeItem>
                </SimpleTreeView>
              </Box>

              {/* PRICE */}
              <Box key="price" display="flex" flexDirection="column">
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Giá
                </Typography>

                <RadioGroup
                  value={`${tableFilters.minPrice},${tableFilters.maxPrice}`}
                  onChange={handlePriceFilterChange}
                >
                  {PRICE_OPTIONS.map((option, index) => (
                    <FormControlLabel
                      key={`${option.value.min}-${index}`}
                      value={`${option.value.min},${option.value.max}`}
                      control={<Radio size="small" />}
                      label={option.label}
                    />
                  ))}
                </RadioGroup>
              </Box>

              {/* ATTRIBUTE */}
              {listAttributes.map((attribute) => (
                <Box key={attribute.id} display="flex" flexDirection="column">
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    {attribute?.name}
                  </Typography>

                  <Autocomplete
                    sx={{ mb: 1 }}
                    fullWidth
                    multiple
                    limitTags={3}
                    options={attribute?.values || []}
                    getOptionLabel={(option) => option.value}
                    renderInput={(params) => <TextField {...params} />}
                    renderOption={(props, option) => (
                      <li {...props} key={option.value}>
                        {option.value}
                      </li>
                    )}
                    renderTags={(selected, getTagProps) =>
                      selected.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={option.value}
                          label={option.value}
                          size="small"
                          variant="soft"
                        />
                      ))
                    }
                  />
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} md={9}>
          <ProductList
            products={products}
            loading={loading}
            pageNumber={tableFilters.pageNumber}
            count={totalPages}
            onPageChange={handlePageChange}
          />

          {productsEmpty && renderNotFound}
        </Grid>
      </Grid>
    </Container>
  );
}
