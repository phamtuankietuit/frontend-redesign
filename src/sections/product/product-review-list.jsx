import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Pagination, { paginationClasses } from '@mui/material/Pagination';

import {
  selectProduct,
  setCommentReport,
} from 'src/state/product/product.slice';
import { selectAuth } from 'src/state/auth/auth.slice';
import {
  getProductRatingsAsync,
  likeCommentAsync,
} from 'src/services/product/product.service';

import { useBoolean } from 'src/hooks/use-boolean';
import { EmptyContent } from 'src/components/empty-content';
import { ProductReviewItem } from './product-review-item';
import { CommentReportForm } from './comment-report-form';

// ----------------------------------------------------------------------

export function ProductReviewList() {
  const dispatch = useDispatch();

  const { user } = useSelector(selectAuth);
  const { product, ratings } = useSelector(selectProduct);

  const reportForm = useBoolean();

  const handleOnChange = (event, page) => {
    dispatch(
      getProductRatingsAsync({
        productId: product.id,
        pageSize: 10,
        pageNumber: page,
      }),
    );
  };

  const notFound =
    !ratings?.ratings?.items || ratings.ratings.items.length === 0;

  const handleLikeComment = useCallback(
    (ratingId) => {
      dispatch(
        likeCommentAsync({ id: product.id, ratingId, customerId: user.id }),
      );
    },
    [dispatch, product.id, user.id],
  );

  return (
    <>
      {ratings?.ratings?.items?.map((review) => (
        <ProductReviewItem
          key={review.id}
          review={review}
          onLikeComment={handleLikeComment}
          onReportComment={() => {
            dispatch(setCommentReport(review));
            reportForm.onTrue();
          }}
        />
      ))}

      {notFound && <EmptyContent sx={{ py: 5 }} />}

      {!notFound && (
        <Pagination
          count={ratings?.ratings?.totalPages}
          onChange={handleOnChange}
          sx={{
            mx: 'auto',
            [`& .${paginationClasses.ul}`]: {
              my: 5,
              mx: 'auto',
              justifyContent: 'center',
            },
          }}
        />
      )}

      <CommentReportForm open={reportForm.value} onClose={reportForm.onFalse} />
    </>
  );
}
