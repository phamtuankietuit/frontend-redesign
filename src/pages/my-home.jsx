import { Helmet } from 'react-helmet-async';

import { MyHomeView } from 'src/sections/my-home/view';

// ----------------------------------------------------------------------

const metadata = {
  title: 'KKBooks',
  description:
    'KKBooks khám phá kho tàng tri thức, kiến thức và sự sáng tạo từ sách.',
};

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Helmet>

      <MyHomeView />
    </>
  );
}
