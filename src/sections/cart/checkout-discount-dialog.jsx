import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { selectPromotion } from 'src/state/promotion/promotion.slice';
import {
  pickDiscount,
  pickFreeShipping,
  selectCart,
  setDiscountInfo,
} from 'src/state/cart/cart.slice';
import {
  getDiscountPromotionsAsync,
  getFreeShippingPromotionsAsync,
} from 'src/services/promotion/promotion.service';
import { updateCartItemsAsync } from 'src/services/cart/cart.service';
import { checkoutConfirm } from 'src/services/checkout/checkout.service';
import { CircularProgress, Divider, Typography } from '@mui/material';
import { DiscountItem } from './components/discount-item';
import { UPDATE_CART_ACTION_TYPE } from './constants';

// ----------------------------------------------------------------------

export function CheckoutDiscountDialog({ open, onClose }) {
  const dispatch = useDispatch();

  const { step, selectedRowIds, freeShippingSelected, discountSelected } =
    useSelector(selectCart);

  const {
    discountPromotions,
    freeShippingPromotions,
    discountPromotionsLoading,
    freeShippingPromotionsLoading,
  } = useSelector(selectPromotion);

  const handleSelect = async (promotion) => {
    if (step === 0) {
      dispatch(pickDiscount(promotion));
      const body = {
        actionType: UPDATE_CART_ACTION_TYPE.SELECT_FOR_CHECKOUT,
        selectedItemIds: selectedRowIds,
        orderDiscountVoucherId: promotion.id,
      };

      dispatch(updateCartItemsAsync(body));
    } else {
      const body = {
        itemIds: selectedRowIds,
        orderDiscountVoucherId: discountSelected?.id || undefined,
        shippingDiscountVoucherId: promotion?.id || undefined,
      };

      if (promotion?.voucherType === 2) {
        dispatch(pickFreeShipping(promotion));
      } else {
        dispatch(pickDiscount(promotion));
        body.shippingDiscountVoucherId = freeShippingSelected?.id || undefined;
        body.orderDiscountVoucherId = promotion?.id || undefined;
      }

      dispatch(checkoutConfirm(body));
    }

    onClose();
  };

  useEffect(() => {
    if (selectedRowIds.length > 0) {
      dispatch(
        getDiscountPromotionsAsync({
          pageNumber: 1,
          pageSize: 100,
          voucherType: 1,
          selectedCartItemIds: selectedRowIds,
          status: 2,
        }),
      );

      if (step === 2) {
        dispatch(
          getFreeShippingPromotionsAsync({
            pageNumber: 1,
            pageSize: 100,
            voucherType: 2,
            selectedCartItemIds: selectedRowIds,
            status: 2,
          }),
        );
      }
    }
  }, [step, dispatch, selectedRowIds]);

  const handleClickDiscountInfo = (info) => {
    dispatch(setDiscountInfo(info));
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle sx={{ p: 2 }}>
        {step === 0 ? 'Chọn khuyến mãi' : 'Chọn mã giảm giá vận chuyển'}
      </DialogTitle>

      <Divider sx={{ borderStyle: 'dashed', borderColor: 'divider' }} />

      <DialogContent dividers sx={{ p: 2, bgcolor: 'grey.200' }}>
        <Stack spacing={1}>
          {discountPromotions.map((promotion, index) => (
            <DiscountItem
              key={promotion.id}
              discount={promotion}
              selected={promotion.id === discountSelected?.id}
              onSelect={() => handleSelect(promotion)}
              disabled={promotion.canApply === false}
              onClickInfo={() => handleClickDiscountInfo(promotion)}
            />
          ))}
        </Stack>

        {discountPromotionsLoading && (
          <Stack justifyContent="center" alignItems="center">
            <CircularProgress />
          </Stack>
        )}

        {discountPromotions.length === 0 && (
          <Stack
            sx={{
              p: 2,
              textAlign: 'center',
              color: 'text.secondary',
            }}
          >
            <Typography variant="body2">
              Không có khuyến mãi nào phù hợp với đơn hàng.
            </Typography>
          </Stack>
        )}

        {step === 2 && <Divider sx={{ my: 2, borderStyle: 'dashed' }} />}

        {step === 2 && (
          <Stack spacing={1}>
            {freeShippingPromotions.map((promotion, index) => (
              <DiscountItem
                key={promotion.id}
                discount={promotion}
                selected={promotion.id === freeShippingSelected?.id}
                onSelect={() => handleSelect(promotion)}
                disabled={promotion.canApply === false}
                onClickInfo={() => handleClickDiscountInfo(promotion)}
              />
            ))}
          </Stack>
        )}

        {step === 2 && freeShippingPromotionsLoading && (
          <Stack justifyContent="center" alignItems="center">
            <CircularProgress />
          </Stack>
        )}

        {step === 2 && freeShippingPromotions.length === 0 && (
          <Stack
            sx={{
              p: 2,
              textAlign: 'center',
              color: 'text.secondary',
            }}
          >
            <Typography variant="body2">
              Không có giảm giá vận chuyển nào phù hợp với đơn hàng.
            </Typography>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
