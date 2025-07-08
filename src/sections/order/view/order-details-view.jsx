import { useSelector } from 'react-redux';

import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { Skeleton } from '@mui/material';

import { selectOrder } from 'src/state/order/order.slice';
import { OrderDetailsInfo } from '../order-details-info';
import { OrderDetailsItems } from '../order-details-item';
import { OrderDetailsToolbar } from '../order-details-toolbar';
import { OrderDetailsHistory } from '../order-details-history';

// ----------------------------------------------------------------------

export function OrderDetailsView({ order }) {
  console.log('🚀 ~ OrderDetailsView ~ order:', order);
  const { orderLoading } = useSelector(selectOrder);

  if (orderLoading) {
    return (
      <Skeleton
        variant="rectangular"
        width="100%"
        height={400}
        sx={{ borderRadius: 1 }}
      />
    );
  }

  return (
    <DashboardContent>
      <OrderDetailsToolbar
        backLink={paths.account.orders}
        orderNumber={order?.orderNumber}
        createdAt={order?.orderWhen}
        status={order?.status}
        order={order}
      />

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
            <OrderDetailsItems order={order} />

            <OrderDetailsHistory
              history={order?.orderHistories || []}
              order={order}
            />
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <OrderDetailsInfo order={order} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
