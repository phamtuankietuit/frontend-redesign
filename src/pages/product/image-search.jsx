import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ImageSearchProductView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

const metadata = { title: `Tìm kiếm bằng hình ảnh - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ImageSearchProductView />
    </>
  );
}
