import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { ProductItem } from './product-item';
import { ProductItemSkeleton } from './product-skeleton';

// ----------------------------------------------------------------------

export function ProductList({
  products,
  loading,
  isShowCart = true,
  isShowPagination = true,
  amount = 8,
  ...other
}) {
  const renderLoading = <ProductItemSkeleton amount={amount} />;

  const renderList = products.map((product) => (
    <ProductItem key={product.id} product={product} isShowCart={isShowCart} />
  ));

  return (
    <>
      <Box
        gap={2}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        }}
        {...other}
      >
        {loading ? renderLoading : renderList}
      </Box>

      {products.length > 8 && isShowPagination && (
        <Pagination
          count={8}
          sx={{
            mt: { xs: 5, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
          }}
        />
      )}
    </>
  );
}
