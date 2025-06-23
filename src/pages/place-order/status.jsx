import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { PlaceOrderStatusView } from 'src/sections/cart/view/place-order-status-view';

// ----------------------------------------------------------------------

const metadata = { title: `Trạng thái đơn hàng - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <PlaceOrderStatusView />
    </>
  );
}
