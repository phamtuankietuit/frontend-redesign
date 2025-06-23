import { useEffect } from 'react';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { useBoolean } from 'src/hooks/use-boolean';
import { Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

import { toast } from 'sonner';
import { paths } from 'src/routes/paths';
import { CONFIG } from 'src/config-global';
import { goToStep, selectCart } from 'src/state/cart/cart.slice';
import {
  checkoutConfirm,
  checkoutPlaceOrder,
} from 'src/services/checkout/checkout.service';
import { useRouter } from 'src/routes/hooks';
import { CheckoutSummary } from './checkout-summary';
import { CheckoutBillingInfo } from './checkout-billing-info';
import { CheckoutPaymentMethods } from './checkout-payment-methods';
import { CheckoutDiscount } from './checkout-discount';
import { CheckoutOrderComplete } from './checkout-order-complete';

// ----------------------------------------------------------------------

const PAYMENT_OPTIONS = [
  {
    value: 1,
    label: 'COD',
    description: 'Thanh toán khi nhận hàng.',
  },
  {
    value: 2,
    label: 'VNPay',
    description: 'Bạn sẽ được điều hướng tới VNPay để hoàn tất thanh toán.',
  },
];

const CARD_OPTIONS = [
  { value: 'visa1', label: '**** **** **** 1212 - Jimmy Holland' },
  { value: 'visa2', label: '**** **** **** 2424 - Shawn Stokes' },
  { value: 'mastercard', label: '**** **** **** 4545 - Cole Armstrong' },
];

export const PaymentSchema = zod.object({
  payment: zod.number(),
  // Not required
  // delivery: zod.number(),
});

// ----------------------------------------------------------------------

export function CheckoutPayment() {
  const dispatch = useDispatch();

  const router = useRouter();

  const {
    selectedRowIds,
    addressSelected,
    discountSelected,
    shippingFee,
    deliveryMethods,
    freeShippingSelected,
  } = useSelector(selectCart);

  const checkout = {};

  const defaultValues = { delivery: checkout.shipping, payment: '' };

  const methods = useForm({
    resolver: zodResolver(PaymentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const openCheckoutOrderComplete = useBoolean(false);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const body = {
        itemIds: selectedRowIds,
        shippingAddressId: addressSelected?.id,
        paymentMethodId: data.payment,
        deliveryMethodId: deliveryMethods[0].id,
        shippingFee,
        expectedDeliveryWhen: deliveryMethods[0].expectedDeliveryWhen,
        orderDiscountVoucherId: discountSelected?.id || undefined,
        shippingVoucherId: freeShippingSelected?.id || undefined,
        note: '',
        paymentReturnUrl: CONFIG.frontendUrl + paths.placeOrder.root,
      };

      await dispatch(checkoutPlaceOrder(body))
        .unwrap()
        .then((response) => {
          if (response?.paymentUrl === '') {
            router.push(`${paths.placeOrder.root}?vnp_ResponseCode=00`);
          } else {
            window.location.href = response?.paymentUrl;
          }
        });
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi thanh toán!');
    }
  });

  useEffect(() => {
    const body = {
      itemIds: selectedRowIds,
      orderDiscountVoucherId: discountSelected?.id || undefined,
    };

    dispatch(checkoutConfirm(body));
  }, [selectedRowIds, dispatch, discountSelected]);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <CheckoutPaymentMethods
            name="payment"
            options={{
              cards: CARD_OPTIONS,
              payments: PAYMENT_OPTIONS,
            }}
            sx={{ my: 3 }}
          />

          <Button
            size="small"
            color="inherit"
            onClick={checkout.onBackStep}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          >
            Trở lại
          </Button>
        </Grid>

        <Grid xs={12} md={4}>
          <CheckoutBillingInfo
            billing={checkout.billing}
            onBackStep={checkout.onBackStep}
          />

          <CheckoutSummary
            total={checkout.total}
            subtotal={checkout.subtotal}
            discount={checkout.discount}
            shipping={checkout.shipping}
            onEdit={() => dispatch(goToStep(0))}
          />

          <CheckoutDiscount />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Thanh toán
          </LoadingButton>
        </Grid>
      </Grid>

      <CheckoutOrderComplete open={openCheckoutOrderComplete.value} />
    </Form>
  );
}
