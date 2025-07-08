import { z as zod } from 'zod';
import { useRouter } from 'src/routes/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { toastMessage } from 'src/utils/constant';

import { Form, Field } from 'src/components/hook-form';
import { selectAuth } from 'src/state/auth/auth.slice';
import { uploadImagesAsync } from 'src/services/file/file.service';
import { ratingProductAsync } from 'src/services/rating/rating.service';
import { toast } from 'sonner';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export const ReviewSchema = zod.object({
  ratingValue: zod.number().min(1, 'Bạn chưa đánh giá sao!'),
  comment: zod.string().min(1, { message: toastMessage.error.empty }),
  images: zod.any().optional(),
});

// ----------------------------------------------------------------------

export function ProductReviewNewForm({
  productId,
  productVariantId,
  onClose,
  ...other
}) {
  const dispatch = useDispatch();

  const { user } = useSelector(selectAuth);

  const router = useRouter();

  const defaultValues = {
    ratingValue: 0,
    comment: '',
    images: [],
  };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(ReviewSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    getValues,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const handleRemoveFile = useCallback(
    (inputFile) => {
      const currentImages = getValues('images');
      const filtered = currentImages?.filter((file) => file !== inputFile);
      setValue('images', filtered, { shouldValidate: true });
    },
    [setValue, getValues],
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', [], { shouldValidate: true });
  }, [setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const newImages = [];

      if (data.images.length > 0) {
        const imgUrls = await dispatch(uploadImagesAsync(data.images)).unwrap();

        if (imgUrls.length > 0) {
          newImages.push(...imgUrls);
        }
      }

      const body = {
        comment: data.comment,
        ratingValue: data.ratingValue,
        imageUrls: newImages,
      };

      await dispatch(
        ratingProductAsync({
          productId,
          variantId: productVariantId,
          body,
        }),
      ).unwrap();

      router.push(paths.account.orders);

      toast.success('Đánh giá sản phẩm thành công!');

      reset();
      onClose();
    } catch (error) {
      console.error(error);
    }
  });

  const onCancel = useCallback(() => {
    onClose();
    reset();
  }, [onClose, reset]);

  return (
    <Dialog onClose={onClose} {...other}>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle> Đánh giá sản phẩm </DialogTitle>

        <DialogContent>
          <div>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Đánh giá của bạn về sản phẩm này:
            </Typography>
            <Field.Rating name="ratingValue" />
          </div>

          <Field.Upload
            multiple
            thumbnail
            name="images"
            maxSize={3145728}
            onRemove={handleRemoveFile}
            onRemoveAll={handleRemoveAllFiles}
            sx={{
              mt: 2,
              maxWidth: {
                xs: 300,
                sm: 480,
              },
            }}
          />

          <Field.Text
            name="comment"
            label="Đánh giá *"
            multiline
            rows={3}
            sx={{
              mt: 3,
              minWidth: {
                xs: 300,
                sm: 480,
              },
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onCancel}>
            Hủy
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Đăng
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
