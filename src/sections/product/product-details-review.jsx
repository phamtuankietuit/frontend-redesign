import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { useBoolean } from 'src/hooks/use-boolean';

import { fShortenNumber } from 'src/utils/format-number';
import { Button } from '@mui/material';

import { selectProduct } from 'src/state/product/product.slice';
import { Iconify } from 'src/components/iconify';
import { ProductReviewList } from './product-review-list';
import { ProductReviewNewForm } from './product-review-new-form';

// ----------------------------------------------------------------------

export function ProductDetailsReview() {
  const review = useBoolean();

  const { ratings } = useSelector(selectProduct);

  const renderSummary = (
    <Stack spacing={1} alignItems="center" justifyContent="center">
      <Typography variant="subtitle2">Đánh giá trung bình</Typography>

      <Typography variant="h2">
        {fShortenNumber(ratings?.averageRating) || 0}/5
      </Typography>

      <Rating readOnly value={ratings?.averageRating} precision={0.1} />

      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        ({fShortenNumber(ratings?.totalRating) || 0} đánh giá)
      </Typography>
    </Stack>
  );

  const renderProgress = (
    <Stack
      spacing={1.5}
      sx={{
        py: 5,
        px: { xs: 3, md: 5 },
        borderLeft: (theme) => ({
          md: `dashed 1px ${theme.vars.palette.divider}`,
        }),
        borderRight: (theme) => ({
          md: `dashed 1px ${theme.vars.palette.divider}`,
        }),
      }}
    >
      <Stack key="5 Start" direction="row" alignItems="center">
        <Typography variant="subtitle2" component="span" sx={{ width: 42 }}>
          5 Sao
        </Typography>
        <LinearProgress
          color="inherit"
          variant="determinate"
          value={
            ((ratings?.total5StarRating || 0) / (ratings?.totalRating || 1)) *
            100
          }
          sx={{ mx: 2, flexGrow: 1 }}
        />
        <Typography
          variant="body2"
          component="span"
          sx={{ minWidth: 48, color: 'text.secondary' }}
        >
          {fShortenNumber(ratings?.total5StarRating || 0)}
        </Typography>
      </Stack>
      <Stack key="4 Start" direction="row" alignItems="center">
        <Typography variant="subtitle2" component="span" sx={{ width: 42 }}>
          4 Sao
        </Typography>{' '}
        <LinearProgress
          color="inherit"
          variant="determinate"
          value={
            ((ratings?.total4StarRating || 0) / (ratings?.totalRating || 1)) *
            100
          }
          sx={{ mx: 2, flexGrow: 1 }}
        />
        <Typography
          variant="body2"
          component="span"
          sx={{ minWidth: 48, color: 'text.secondary' }}
        >
          {fShortenNumber(ratings?.total4StarRating || 0)}
        </Typography>
      </Stack>
      <Stack key="3 Start" direction="row" alignItems="center">
        <Typography variant="subtitle2" component="span" sx={{ width: 42 }}>
          3 Sao
        </Typography>{' '}
        <LinearProgress
          color="inherit"
          variant="determinate"
          value={
            ((ratings?.total3StarRating || 0) / (ratings?.totalRating || 1)) *
            100
          }
          sx={{ mx: 2, flexGrow: 1 }}
        />
        <Typography
          variant="body2"
          component="span"
          sx={{ minWidth: 48, color: 'text.secondary' }}
        >
          {fShortenNumber(ratings?.total3StarRating || 0)}
        </Typography>
      </Stack>
      <Stack key="2 Start" direction="row" alignItems="center">
        <Typography variant="subtitle2" component="span" sx={{ width: 42 }}>
          2 Sao
        </Typography>
        <LinearProgress
          color="inherit"
          variant="determinate"
          value={
            ((ratings?.total2StarRating || 0) / (ratings?.totalRating || 1)) *
            100
          }
          sx={{ mx: 2, flexGrow: 1 }}
        />
        <Typography
          variant="body2"
          component="span"
          sx={{ minWidth: 48, color: 'text.secondary' }}
        >
          {fShortenNumber(ratings?.total2StarRating || 0)}
        </Typography>
      </Stack>
      <Stack key="1 Start" direction="row" alignItems="center">
        <Typography variant="subtitle2" component="span" sx={{ width: 42 }}>
          1 Sao
        </Typography>{' '}
        <LinearProgress
          color="inherit"
          variant="determinate"
          value={
            ((ratings?.total1StarRating || 0) / (ratings?.totalRating || 1)) *
            100
          }
          sx={{ mx: 2, flexGrow: 1 }}
        />
        <Typography
          variant="body2"
          component="span"
          sx={{ minWidth: 48, color: 'text.secondary' }}
        >
          {fShortenNumber(ratings?.total1StarRating || 0)}
        </Typography>
      </Stack>
    </Stack>
  );

  // const renderReviewButton = (
  //   <Stack alignItems="center" justifyContent="center">
  //     <Button
  //       size="large"
  //       variant="soft"
  //       color="inherit"
  //       onClick={review.onTrue}
  //       startIcon={<Iconify icon="solar:pen-bold" />}
  //     >
  //       Viết đánh giá
  //     </Button>
  //   </Stack>
  // );

  return (
    <>
      <Box
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        sx={{ py: { xs: 5, md: 0 } }}
      >
        {renderSummary}

        {renderProgress}

        {/* {renderReviewButton} */}
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <ProductReviewList />

      <ProductReviewNewForm open={review.value} onClose={review.onFalse} />
    </>
  );
}
