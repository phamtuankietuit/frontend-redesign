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
} from 'src/state/cart/cart.slice';
import { getPromotionsAsync } from 'src/services/promotion/promotion.service';
import { updateCartItemsAsync } from 'src/services/cart/cart.service';
import { checkoutConfirm } from 'src/services/checkout/checkout.service';
import { Divider, Typography } from '@mui/material';
import { DiscountItem } from './components/discount-item';
import { UPDATE_CART_ACTION_TYPE } from './constants';

// ----------------------------------------------------------------------

export function CheckoutDiscountDialog({ open, onClose }) {
  const dispatch = useDispatch();

  const { step, selectedRowIds, freeShippingSelected, discountSelected } =
    useSelector(selectCart);

  const { promotions } = useSelector(selectPromotion);

  const handleSelect = (promotion) => {
    if (step === 0) {
      dispatch(pickDiscount(promotion));
      const body = {
        actionType: UPDATE_CART_ACTION_TYPE.SELECT_FOR_CHECKOUT,
        selectedItemIds: selectedRowIds,
        orderDiscountVoucherId: promotion.id,
      };

      dispatch(updateCartItemsAsync(body));
    } else {
      dispatch(pickFreeShipping(promotion));

      const body = {
        itemIds: selectedRowIds,
        orderDiscountVoucherId: discountSelected?.id || undefined,
        shippingDiscountVoucherId: promotion?.id || undefined,
      };

      dispatch(checkoutConfirm(body));
    }

    onClose();
  };

  useEffect(() => {
    dispatch(
      getPromotionsAsync({
        pageNumber: 1,
        pageSize: 100,
        voucherType: step === 0 ? 1 : 2,
        selectedCartItemIds: selectedRowIds,
        status: 2,
      }),
    );
  }, [step, dispatch, selectedRowIds]);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle sx={{ p: 2 }}>
        {step === 0 ? 'Chọn khuyến mãi' : 'Chọn mã giảm giá vận chuyển'}
      </DialogTitle>

      <Divider sx={{ borderStyle: 'dashed', borderColor: 'divider' }} />

      <DialogContent dividers sx={{ p: 2, bgcolor: 'grey.200' }}>
        <Stack spacing={1}>
          {promotions.map((promotion, index) => (
            <DiscountItem
              key={promotion.id}
              discount={promotion}
              selected={
                promotion.id === discountSelected?.id ||
                promotion.id === freeShippingSelected?.id
              }
              onSelect={() => handleSelect(promotion)}
              disabled={promotion.canApply === false}
            />
          ))}
        </Stack>

        {promotions.length === 0 && (
          <Stack
            sx={{
              p: 2,
              textAlign: 'center',
              color: 'text.secondary',
            }}
          >
            <Typography variant="body2">
              Không có khuyến mãi nào phù hợp với đơn hàng của bạn.
            </Typography>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
