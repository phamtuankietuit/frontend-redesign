import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useCallback } from 'react';

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
import {
  resetAttributeFilters,
  selectProduct,
  setAttributeFilters,
} from 'src/state/product/product.slice';
import { selectProductType } from 'src/state/product-type/product-type.slice';
import {
  getProductTypeByIdAsync,
  getProductTypesFlattenAsync,
  getProductTypeAttributesAsync,
} from 'src/services/product-type/product-type.service';
import { getProductsAsync } from 'src/services/product/product.service';

import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProductList } from '../product-list';
import { ProductSort } from '../product-sort';

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

  const productTypeId = searchParams.get('productTypeId') || '1';
  const pageNumber = searchParams.get('pageNumber') || 1;
  const minPrice = searchParams.get('minPrice') || 0;
  const maxPrice = searchParams.get('maxPrice') || 999999999;
  const sortBy = searchParams.get('sortBy') || 'CreationTime';
  const sortDirection = searchParams.get('sortDirection') || 'desc';
  const search = searchParams.get('search') || '';

  let sortValue = '';
  if (sortBy === 'CreationTime') {
    sortValue = 'CreationTime';
  } else if (sortBy === 'MinUnitPrice') {
    const direction = sortDirection === 'desc' ? 'Desc' : 'Asc';
    sortValue = `MinUnitPrice${direction}`;
  }

  const {
    catalogPage: {
      products,
      tableFilters,
      loading,
      error,
      totalPages,
      attributeFilters,
      expandedItems,
      breadcrumbs,
      attributes,
    },
  } = useSelector(selectProduct);

  const { productTypesFlatten } = useSelector(selectProductType);

  const productsEmpty = (products.length === 0 && !loading) || error;

  const handleSortBy = (newValue) => {
    const newParams = new URLSearchParams(searchParams.toString());

    switch (newValue) {
      case 'CreationTime':
        newParams.set('sortBy', 'CreationTime');
        newParams.set('sortDirection', 'desc');
        break;
      case 'MinUnitPriceDesc':
        newParams.set('sortBy', 'MinUnitPrice');
        newParams.set('sortDirection', 'desc');
        break;
      case 'MinUnitPriceAsc':
        newParams.set('sortBy', 'MinUnitPrice');
        newParams.set('sortDirection', 'asc');
        break;
      default:
        break;
    }
    newParams.set('pageNumber', 1);
    setSearchParams(newParams);
  };

  const handleSelectedTreeView = (event, itemIds) => {
    const newParams = updateURLParams(searchParams, {
      productTypeId: itemIds,
      pageNumber: 1,
    });
    setSearchParams(newParams);
    dispatch(resetAttributeFilters({}));
  };

  const handlePageChange = (event, newPage) => {
    const newParams = updateURLParams(searchParams, { pageNumber: newPage });
    setSearchParams(newParams);
  };

  const handlePriceFilterChange = (e, value) => {
    const [min, max] = value.split(',').map((item) => Number(item));

    const newParams = updateURLParams(searchParams, {
      pageNumber: 1,
      minPrice: min,
      maxPrice: max,
    });
    setSearchParams(newParams);
  };

  const handleChangeCustomFilters = useCallback(
    (attributeId, selectedValues) => {
      dispatch(
        setAttributeFilters({
          attributeId,
          selectedValues,
        }),
      );
    },
    [dispatch],
  );

  const fetchAttributesData = useCallback(() => {
    dispatch(getProductTypeAttributesAsync(productTypeId));
  }, [dispatch, productTypeId]);

  useEffect(() => {
    fetchAttributesData();
  }, [fetchAttributesData]);

  const fetchProductTypesFlattenData = useCallback(() => {
    dispatch(getProductTypesFlattenAsync());
  }, [dispatch]);

  useEffect(() => {
    fetchProductTypesFlattenData();
  }, [fetchProductTypesFlattenData]);

  const fetchBreadcrumbsData = useCallback(() => {
    dispatch(
      getProductTypeByIdAsync({
        id: productTypeId,
        params: { withParent: true },
      }),
    );
  }, [dispatch, productTypeId]);

  useEffect(() => {
    fetchBreadcrumbsData();
  }, [fetchBreadcrumbsData]);

  const fetchData = useCallback(() => {
    const customFilters = {};

    if (attributeFilters && Object.keys(attributeFilters).length > 0) {
      Object.keys(attributeFilters)?.forEach((key) => {
        attributeFilters[key].forEach((item) => {
          const propName = String(item.name);
          const value = item.value;

          if (!customFilters[propName]) {
            customFilters[propName] = [];
          }

          customFilters[propName].push(value);
        });
      });
    }

    dispatch(
      getProductsAsync({
        pageNumber,
        pageSize: tableFilters.pageSize,
        productTypeIds: [productTypeId],
        sortBy,
        sortDirection,
        minPrice,
        maxPrice,
        customFilters,
        searchQuery: search,
      }),
    );
  }, [
    dispatch,
    productTypeId,
    tableFilters,
    pageNumber,
    sortBy,
    sortDirection,
    minPrice,
    maxPrice,
    attributeFilters,
    search,
  ]);

  useEffect(() => {
    fetchData();
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
          sort={sortValue}
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
      <Stack
        direction="row"
        spacing={2.5}
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          my: { xs: 1, md: 3 },
        }}
      >
        {!search && (
          <CustomBreadcrumbs
            links={[{ name: 'Trang chủ', href: '/' }, ...breadcrumbs]}
          />
        )}

        {!search && renderFilters}

        {search && (
          <Typography variant="body2" sx={{ flexGrow: 1 }}>
            {`Kết quả tìm kiếm cho "${search}"`}
          </Typography>
        )}
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: 'fit-content', p: 2 }}>
            <Stack spacing={1} divider={<Divider />}>
              {/* CATEGORY */}
              {!search && (
                <Box key="category" display="flex" flexDirection="column">
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Danh mục sản phẩm
                  </Typography>

                  <SimpleTreeView
                    sx={{ overflowX: 'hidden', width: 1 }}
                    selectedItems={[productTypeId || '1']}
                    onSelectedItemsChange={handleSelectedTreeView}
                    expandedItems={[...expandedItems]}
                    expansionTrigger="iconContainer"
                    slotProps={{
                      collapseIcon: {
                        sx: { display: 'none' },
                      },
                    }}
                  >
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
                  </SimpleTreeView>
                </Box>
              )}
              {/* PRICE */}
              <Box key="price" display="flex" flexDirection="column">
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Giá
                </Typography>

                <RadioGroup
                  value={`${minPrice},${maxPrice}`}
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
              {!search &&
                attributes.map((attribute) => (
                  <Box key={attribute.id} display="flex" flexDirection="column">
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      {attribute?.name}
                    </Typography>
                    <Autocomplete
                      sx={{ mb: 1 }}
                      fullWidth
                      multiple
                      limitTags={3}
                      value={attributeFilters[attribute.id] || []}
                      onChange={(event, newValue) =>
                        handleChangeCustomFilters(attribute.id, newValue)
                      }
                      options={attribute?.values || []}
                      getOptionLabel={(option) => option.value}
                      isOptionEqualToValue={(option, value) =>
                        option.attributeValueId === value.attributeValueId
                      }
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
            pageNumber={Number(pageNumber)}
            count={totalPages}
            onPageChange={handlePageChange}
            fourItems
          />

          {productsEmpty && renderNotFound}
        </Grid>
      </Grid>
    </Container>
  );
}
