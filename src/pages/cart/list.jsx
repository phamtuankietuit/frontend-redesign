import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { CartView } from 'src/sections/cart/view';

// ----------------------------------------------------------------------

const metadata = { title: `Giỏ hàng - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <CartView />
    </>
  );
}
