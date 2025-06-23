import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { OrderDetailsView } from 'src/sections/order/view';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderByIdAsync } from 'src/services/order/order.service';
import { selectOrder } from 'src/state/order/order.slice';

// ----------------------------------------------------------------------

const metadata = { title: `Chi tiết đơn hàng - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();
  const dispatch = useDispatch();

  const { order } = useSelector(selectOrder);

  useEffect(() => {
    dispatch(getOrderByIdAsync(id));
  }, [id, dispatch]);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OrderDetailsView order={order} />
    </>
  );
}
