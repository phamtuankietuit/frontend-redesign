import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { ProductItem } from './product-item';
import { ProductItemSkeleton } from './product-skeleton';

// ----------------------------------------------------------------------

export function ProductList({
  products,
  loading,
  isShowCart = false,
  isShowPagination = true,
  amount = 10,
  pageNumber = 1,
  count = 1,
  onPageChange,
  fourItems = false,
  ...other
}) {
  const renderLoading = <ProductItemSkeleton amount={amount} />;

  const renderList = products?.map((product, index) => (
    <ProductItem key={index} product={product} isShowCart={isShowCart} />
  ));

  return (
    <>
      <Box
        gap={2}
        display="grid"
        gridTemplateColumns={
          !fourItems
            ? {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
                lg: 'repeat(5, 1fr)',
              }
            : {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              }
        }
        {...other}
      >
        {loading ? renderLoading : renderList}
      </Box>

      {products?.length > 0 && isShowPagination && (
        <Pagination
          count={count}
          page={pageNumber}
          onChange={onPageChange}
          sx={{
            mt: { xs: 5, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
          }}
        />
      )}
    </>
  );
}
