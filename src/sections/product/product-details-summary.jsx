import { useForm } from 'react-hook-form';
import { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import { Link, Button } from '@mui/material';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';

import { findMatchingVariant } from 'src/utils/helper';
import { fCurrency, fMyShortenNumber } from 'src/utils/format-number';

import { selectProduct } from 'src/state/product/product.slice';
import { getProductOptionsAsync } from 'src/services/product/product.service';
import {
  addCartItemAsync,
  getCartItemsAsync,
} from 'src/services/cart/cart.service';

import { Form } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import MyOption from 'src/components/my-option/my-option';

import { IncrementerButton } from './components/incrementer-button';

// ----------------------------------------------------------------------

export function ProductDetailsSummary({
  items,
  product,
  onAddCart,
  onGotoStep,
  ...other
}) {
  const dispatch = useDispatch();

  const { id, name: productName, productVariants } = product;

  const { productOptions } = useSelector(selectProduct);

  const isOneVariant = product?.productVariants?.length === 1;

  const isSelectedOptions = useBoolean(false);

  const defaultValues = useMemo(
    () => ({
      id: product?.id || '',
      productName: product?.name || '',
      quantity: 1,
      available: product?.totalStockQuantity,
      selectedOptions: null,
      displayPrice: product?.minUnitPrice || 0,
      displayRecommendedRetailPrice: product?.minRecommendedRetailPrice || 0,
      price: product?.minUnitPrice || 0,
      result: null,
    }),
    [product],
  );

  const methods = useForm({ defaultValues });

  const { reset, watch, setValue, handleSubmit } = methods;

  const values = watch();

  useEffect(() => {
    if (product) {
      reset(defaultValues);
      dispatch(getProductOptionsAsync(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  useEffect(() => {
    if (productOptions.length > 0) {
      const selectedOptions = productOptions.map((option) => ({
        ...option,
        selected: null,
      }));

      setValue('selectedOptions', selectedOptions);
    }
  }, [productOptions, product, setValue]);

  const handleFindMatchingVariant = (selectedVariants) => {
    if (selectedVariants.every((variant) => variant.selected !== null)) {
      const result = findMatchingVariant(selectedVariants, productVariants);
      if (result) {
        setValue('result', result);
        isSelectedOptions.onTrue();
        setValue('displayPrice', result.unitPrice);
        setValue(
          'displayRecommendedRetailPrice',
          result.recommendedRetailPrice,
        );
        setValue('available', result.stockQuantity);
      }
    }
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      value?.selectedOptions?.forEach((_, index) => {
        if (name === `selectedOptions[${index}].selected`) {
          handleFindMatchingVariant(value.selectedOptions);
        }
      });
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!isOneVariant && !isSelectedOptions.value) {
        toast.warning('Vui lòng chọn phân loại sản phẩm!');
      } else {
        console.log('🚀 ~ onSubmit ~ data:', data);
      }
    } catch (error) {
      console.error(error);
    }
  });

  const handleAddCart = useCallback(async () => {
    try {
      const body = {
        productVariantId: values?.result?.id,
        quantity: values.quantity,
      };

      const oneVariant =
        product?.productVariants?.length === 1 &&
        product?.productVariants[0].optionValues.length === 0;

      if (oneVariant) {
        body.productVariantId = product?.productVariants[0]?.id;
      }

      // console.log('🚀 ~ handleAddCart ~ body:', body);

      if (values?.result?.id || oneVariant) {
        await dispatch(addCartItemAsync(body)).unwrap();
        await dispatch(getCartItemsAsync()).unwrap();
        toast.success('Thêm sản phẩm vào giỏ hàng thành công!');
      } else {
        toast.warning('Vui lòng chọn phân loại sản phẩm!');
      }
      // }
    } catch (error) {
      console.error(error);
    }
  }, [values, dispatch, product]);

  const renderRecommendedRetailPrice =
    product?.minRecommendedRetailPrice !==
    product?.maxRecommendedRetailPrice ? (
      <Stack direction="row" spacing={2} justifyContent="center">
        <Box
          component="span"
          sx={{
            color: 'text.disabled',
            textDecoration: 'line-through',
            mr: 0.5,
          }}
        >
          {fCurrency(product?.minRecommendedRetailPrice)}
        </Box>
        <Box sx={{ typography: 'body2', color: 'text.disabled' }}>-</Box>
        <Box
          component="span"
          sx={{
            color: 'text.disabled',
            textDecoration: 'line-through',
            mr: 0.5,
          }}
        >
          {fCurrency(product?.maxRecommendedRetailPrice)}
        </Box>
      </Stack>
    ) : (
      <Box
        component="span"
        sx={{
          color: 'text.disabled',
          textDecoration: 'line-through',
          mr: 0.5,
        }}
      >
        {fCurrency(product?.minRecommendedRetailPrice)}
      </Box>
    );

  const renderPrice =
    product?.minUnitPrice !== product?.maxUnitPrice ? (
      <>
        {!!product?.minRecommendedRetailPrice && renderRecommendedRetailPrice}

        <Stack direction="row" spacing={2} justifyContent="center">
          <Box sx={{ typography: 'h5' }}>
            {fCurrency(product?.minUnitPrice)}
          </Box>
          <Box sx={{ typography: 'h5' }}>-</Box>
          <Box sx={{ typography: 'h5' }}>
            {fCurrency(product?.maxUnitPrice)}
          </Box>
        </Stack>
      </>
    ) : (
      <>
        {!!product?.minRecommendedRetailPrice && renderRecommendedRetailPrice}

        <Box sx={{ typography: 'h5' }}>{fCurrency(product?.minUnitPrice)}</Box>
      </>
    );

  const renderDisplayPrice = (
    <>
      <Box
        component="span"
        sx={{
          color: 'text.disabled',
          textDecoration: 'line-through',
          mr: 0.5,
        }}
      >
        {fCurrency(values.displayRecommendedRetailPrice)}
      </Box>

      <Box sx={{ typography: 'h5' }}>{fCurrency(values.displayPrice)}</Box>
    </>
  );

  const renderShare = (
    <Stack direction="row" spacing={3} justifyContent="center">
      <Link
        variant="subtitle2"
        sx={{
          color: 'text.secondary',
          display: 'inline-flex',
          alignItems: 'center',
          ':hover': {
            cursor: 'pointer',
          },
        }}
      >
        <Iconify icon="solar:heart-bold" width={16} sx={{ mr: 1 }} />
        Yêu Thích
      </Link>

      <Link
        variant="subtitle2"
        sx={{
          color: 'text.secondary',
          display: 'inline-flex',
          alignItems: 'center',
          ':hover': {
            cursor: 'pointer',
          },
        }}
      >
        <Iconify icon="solar:share-bold" width={16} sx={{ mr: 1 }} />
        Chia sẻ
      </Link>
    </Stack>
  );

  const renderOptions = productOptions?.map((option, index) => (
    <Stack key={option.variantName} direction="column" gap={2.5}>
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        {option.variantName}
      </Typography>

      <MyOption
        name={`selectedOptions[${index}].selected`}
        values={option.values}
      />
    </Stack>
  ));

  const renderQuantity = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Số lượng
      </Typography>

      <Stack spacing={1}>
        <IncrementerButton
          name="quantity"
          quantity={values.quantity}
          disabledDecrease={values.quantity <= 1}
          disabledIncrease={values.quantity >= values.available}
          onIncrease={() => setValue('quantity', values.quantity + 1)}
          onDecrease={() => setValue('quantity', values.quantity - 1)}
        />
      </Stack>
    </Stack>
  );

  const renderActions = (
    <Stack
      direction="row"
      spacing={2}
      flexWrap={{
        xs: 'wrap',
        sm: 'nowrap',
      }}
    >
      <Button
        fullWidth
        disabled={!values.available}
        size="large"
        color="warning"
        variant="contained"
        startIcon={<Iconify icon="solar:cart-plus-bold" width={24} />}
        onClick={handleAddCart}
        sx={{ whiteSpace: 'nowrap' }}
      >
        Thêm vào giỏ hàng
      </Button>

      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        disabled={!values.available}
      >
        Mua ngay
      </Button>
    </Stack>
  );

  const renderRating = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{ color: 'text.disabled', typography: 'body2' }}
    >
      <Rating
        size="small"
        value={product?.averageRating || 0}
        precision={0.1}
        readOnly
        sx={{ mr: 1 }}
      />

      {`(${fMyShortenNumber(Number(product?.ratingsCount || 0))} đánh giá)`}
    </Stack>
  );

  const renderInventoryType = (
    <Box
      component="span"
      sx={{
        typography: 'overline',
        color: (values.available < 1 && 'error.main') || 'success.main',
      }}
    >
      {values.available < 1 && 'Hết hàng'}
      {values.available > 0 && 'Còn hàng'}
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ pt: 3 }} {...other}>
        <Stack spacing={2} alignItems="flex-start">
          {renderInventoryType}

          <Typography variant="h5">{productName}</Typography>

          {renderRating}

          {isOneVariant && renderDisplayPrice}

          {!isOneVariant && !isSelectedOptions.value && renderPrice}

          {!isOneVariant && isSelectedOptions.value && renderDisplayPrice}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {renderOptions}

        {renderQuantity}

        <Divider sx={{ borderStyle: 'dashed' }} />

        {renderActions}

        {renderShare}
      </Stack>
    </Form>
  );
}
