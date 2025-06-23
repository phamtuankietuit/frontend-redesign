import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { PlaceOrderFailureView } from 'src/sections/cart/view/place-order-failure-view';

// ----------------------------------------------------------------------

const metadata = { title: `Đặt hàng thất bại - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <PlaceOrderFailureView />
    </>
  );
}
