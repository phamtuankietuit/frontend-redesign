import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CenteredRegisterView } from 'src/auth/view';

// ----------------------------------------------------------------------

const metadata = { title: `Đăng ký - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CenteredRegisterView />
    </>
  );
}
