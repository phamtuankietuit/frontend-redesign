import { useState } from 'react';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Stack, Typography } from '@mui/material';
import { updateCartItemsAsync } from 'src/services/cart/cart.service';
import { useBoolean } from 'src/hooks/use-boolean';
import { UPDATE_CART_ACTION_TYPE } from './constants';

export function VariantsForm({ row, onClose }) {
  const dispatch = useDispatch();

  const loading = useBoolean(false);

  const [selectedVariant, setSelectedVariant] = useState(() => {
    const initialSelection = {};

    if (row?.productVariantName && row?.productOptions) {
      // Parse the productVariantName (e.g., "2021, Nhựa 203" -> ["2021", "Nhựa 203"])
      const variantValues = row.productVariantName
        .split(', ')
        .map((v) => v.trim());

      row.productOptions.forEach((option, index) => {
        // Match the variant value to the option
        if (
          variantValues[index] &&
          option.values.includes(variantValues[index])
        ) {
          initialSelection[option.name] = variantValues[index];
        } else {
          // Fallback to first value if no match found
          initialSelection[option.name] = option.values[0];
        }
      });
    } else {
      // Fallback: use first value for each option
      row?.productOptions?.forEach((option) => {
        initialSelection[option.name] = option.values[0];
      });
    }

    return initialSelection;
  });

  const handleSubmit = async () => {
    try {
      loading.onTrue();

      const matchingVariant = row?.productVariantVariations?.find((variant) =>
        row?.productOptions?.every((option, index) => {
          const selectedValue = selectedVariant[option.name];
          const variantOptionValue =
            option.values[variant.optionIndex?.[index] || 0];

          return selectedValue === variantOptionValue;
        }),
      );

      console.log(
        '🚀 ~ row?.productOptions?.every ~ selectedVariant:',
        selectedVariant,
      );

      if (matchingVariant) {
        const body = {
          actionType: UPDATE_CART_ACTION_TYPE.UPDATE_PRODUCT_VARIANT,
          updateItems: [
            {
              id: row.id,
              quantity: row.quantity,
              oldQuantity: row.quantity,
              productVariantId: matchingVariant.id,
              oldProductVariantId: row.productVariantId,
            },
          ],
        };

        await dispatch(updateCartItemsAsync(body)).unwrap();

        toast.success('Cập nhật phân loại sản phẩm thành công!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi cập nhật phân loại sản phẩm!');
    } finally {
      loading.onFalse();
      onClose();
    }
  };

  const handleVariantSelect = (optionName, value) => {
    setSelectedVariant((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  return (
    <Box sx={{ minWidth: 350, p: 2 }}>
      <Box sx={{ maxHeight: 250, overflowY: 'auto', mb: 1 }}>
        {row?.productOptions?.map((option, index) => (
          <Stack key={`option-${index}`} spacing={1} sx={{ mb: 2 }}>
            <Typography variant="subtitle2">{option.name}</Typography>

            <Stack direction="column" spacing={1} sx={{ width: '100%' }}>
              {option?.values?.map((value) => (
                <Button
                  key={value}
                  variant={
                    selectedVariant[option.name] === value
                      ? 'contained'
                      : 'outlined'
                  }
                  size="small"
                  color="primary"
                  onClick={() => handleVariantSelect(option.name, value)}
                  sx={{
                    borderColor:
                      selectedVariant[option.name] === value
                        ? 'primary.main'
                        : 'grey.400',
                    '&:hover': {
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  {value}
                </Button>
              ))}
            </Stack>
          </Stack>
        ))}

        <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Đã chọn:{' '}
            {Object.entries(selectedVariant)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ')}
          </Typography>
        </Box>
      </Box>

      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          size="small"
          onClick={onClose}
          sx={{ width: '100%' }}
        >
          Đóng
        </Button>

        <LoadingButton
          onClick={handleSubmit}
          variant="contained"
          size="small"
          sx={{ width: '100%' }}
          loading={loading.value}
        >
          Xác nhận
        </LoadingButton>
      </Stack>
    </Box>
  );
}
