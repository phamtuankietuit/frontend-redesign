import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useState } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Card, Grid } from '@mui/material';

import { selectProduct } from 'src/state/product/product.slice';

import { EmptyContent } from 'src/components/empty-content';

import { getProductByImageAsync } from 'src/services/product/product.service';
import { UploadBox } from 'src/components/upload';
import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';
import { ProductList } from '../product-list';

// ----------------------------------------------------------------------

export function ImageSearchProductView() {
  const dispatch = useDispatch();

  const [avatarUrl, setAvatarUrl] = useState(null);

  const {
    catalogPage: { products: newProducts },
    imageSearchPage: { products, loading, error },
  } = useSelector(selectProduct);

  const productsEmpty = (products?.length === 0 && !loading) || error;

  const handleDropAvatar = useCallback(
    (acceptedFiles) => {
      const newFile = acceptedFiles[0];
      setAvatarUrl(newFile);

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        const [type, base64String] = base64.split('base64,');

        dispatch(getProductByImageAsync(base64String));
      };
      reader.readAsDataURL(newFile);
    },
    [dispatch],
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
        <Card sx={{ p: 3, width: '100%' }}>
          <Stack spacing={3} alignItems="center">
            <Typography variant="h5">
              Tìm kiếm sản phẩm bằng hình ảnh
            </Typography>

            <Stack
              direction="row"
              spacing={3}
              sx={{ width: '100%', maxHeight: 300 }}
            >
              <UploadBox
                placeholder={
                  <Stack spacing={0.5} alignItems="center">
                    <Iconify icon="eva:cloud-upload-fill" width={40} />
                    <Typography variant="body2">Upload file</Typography>
                  </Stack>
                }
                sx={{ py: 2.5, width: '50%', height: 'auto' }}
                onDrop={handleDropAvatar}
              />

              <Image
                alt="Uploaded Image"
                src={avatarUrl ? URL.createObjectURL(avatarUrl) : ''}
                sx={{
                  borderRadius: 2,
                  objectFit: 'cover',
                  width: '50%',
                }}
              />
            </Stack>
          </Stack>
        </Card>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <ProductList
            products={products}
            loading={loading}
            // pageNumber={Number(pageNumber)}
            // count={totalPages}
            // onPageChange={handlePageChange}
            isShowPagination={false}
          />

          {productsEmpty && renderNotFound}
        </Grid>
      </Grid>
    </Container>
  );
}
