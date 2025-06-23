import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { useParams } from 'src/routes/hooks';
import { CampaignView } from 'src/sections/campaign/view/campaign-view';
import { getBannerByIdAsync } from 'src/services/banner/banner.service';

// ----------------------------------------------------------------------

const metadata = {
  title: 'KKBooks',
  description:
    'KKBooks khám phá kho tàng tri thức, kiến thức và sự sáng tạo từ sách.',
};

export default function Page() {
  const dispatch = useDispatch();

  const { id = '' } = useParams();

  useEffect(() => {
    dispatch(getBannerByIdAsync(id));
  }, [id, dispatch]);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Helmet>

      <CampaignView />
    </>
  );
}
