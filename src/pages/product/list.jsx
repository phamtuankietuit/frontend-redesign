import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ProductShopView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

const metadata = { title: `Sản phẩm - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductShopView />
    </>
  );
}
