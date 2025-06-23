import { useSelector } from 'react-redux';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { Iconify } from 'src/components/iconify';
import { fDateTime, formatStr } from 'src/utils/format-time';
import { Box, ButtonBase } from '@mui/material';
import { selectAuth } from 'src/state/auth/auth.slice';

// ----------------------------------------------------------------------

export function ProductReviewItem({ review, onLikeComment, onReportComment }) {
  const { user } = useSelector(selectAuth);

  const renderInfo = (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{ xs: 'row', md: 'column' }}
      sx={{ width: { md: 240 }, textAlign: { md: 'center' } }}
    >
      <Avatar
        src={review.userAvatarUrl}
        sx={{ width: { xs: 48, md: 64 }, height: { xs: 48, md: 64 } }}
      />

      <ListItemText
        primary={review.fullName}
        secondary={fDateTime(review.creationTime, formatStr.myFormat.dateTime)}
        primaryTypographyProps={{
          noWrap: true,
          typography: 'subtitle2',
          mb: 0.5,
        }}
        secondaryTypographyProps={{
          noWrap: true,
          typography: 'caption',
          component: 'span',
        }}
      />
    </Stack>
  );

  const renderContent = (
    <Stack
      spacing={1}
      flexGrow={1}
      sx={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Rating
        size="small"
        value={review.ratingValue}
        precision={0.1}
        readOnly
      />

      <Stack
        direction="row"
        alignItems="center"
        sx={{ typography: 'caption' }}
        spacing={0.5}
      >
        <Typography variant="caption">Phân loại: </Typography>
        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
          {review.productVariantName}
        </Typography>
      </Stack>

      <Typography variant="body2">{review.comment}</Typography>

      {!!review.imageUrls?.length && (
        <Stack direction="row" flexWrap="wrap" spacing={1} sx={{ pt: 1 }}>
          {review.imageUrls.map((attachment) => (
            <Box
              key={attachment}
              component="img"
              alt={attachment}
              src={attachment}
              sx={{ width: 64, height: 64, borderRadius: 1.5 }}
            />
          ))}
        </Stack>
      )}

      {user && (
        <Stack direction="row" spacing={2} sx={{ pt: 1.5 }}>
          <ButtonBase
            disableRipple
            sx={{ gap: 0.5, typography: 'caption' }}
            onClick={() => onLikeComment(review.id)}
          >
            <Iconify icon="solar:like-outline" width={16} />
            {review.likesCount || 0}
          </ButtonBase>
          <ButtonBase
            disableRipple
            sx={{ gap: 0.5, typography: 'caption' }}
            onClick={() => onReportComment(review.id)}
          >
            <Iconify icon="material-symbols:report-outline" width={16} />
            Báo cáo
          </ButtonBase>
        </Stack>
      )}
    </Stack>
  );

  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ mt: 5, px: { xs: 2.5, md: 0 } }}
    >
      {renderInfo}

      {renderContent}
    </Stack>
  );
}
