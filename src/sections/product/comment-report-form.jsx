import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { z as zod } from 'zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { toastMessage } from 'src/utils/constant';

import { selectProduct } from 'src/state/product/product.slice';
import { reportCommentAsync } from 'src/services/product/product.service';
import { Stack } from '@mui/material';
import { Form, Field } from 'src/components/hook-form';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import { ComponentBlock } from '../_examples/component-block';

const REPORT_OPTIONS = [
  {
    id: 'spam',
    label: 'Spam hoặc quảng cáo',
    children: [
      { id: 'report-spam-ad', label: 'Quảng cáo sản phẩm/dịch vụ' },
      { id: 'report-spam-link', label: 'Chứa link độc hại' },
      { id: 'report-spam-repeat', label: 'Lặp lại nhiều lần' },
    ],
  },
  {
    id: 'hate-speech',
    label: 'Ngôn ngữ thù địch',
    children: [
      { id: 'report-hate-race', label: 'Kỳ thị chủng tộc' },
      { id: 'report-hate-religion', label: 'Kỳ thị tôn giáo' },
      { id: 'report-hate-gender', label: 'Kỳ thị giới tính' },
    ],
  },
  {
    id: 'harassment',
    label: 'Quấy rối hoặc đe dọa',
    children: [
      { id: 'report-harass-insult', label: 'Chửi bới, lăng mạ' },
      { id: 'report-harass-threat', label: 'Đe dọa bạo lực' },
      { id: 'report-harass-stalk', label: 'Quấy rối, theo dõi' },
    ],
  },
  {
    id: 'sexual-content',
    label: 'Nội dung khiêu dâm',
    children: [
      { id: 'report-sexual-explicit', label: 'Hình ảnh/giai thoại khiêu dâm' },
      { id: 'report-sexual-suggestive', label: 'Ngụ ý tình dục' },
      { id: 'report-sexual-minor', label: 'Liên quan trẻ vị thành niên' },
    ],
  },
  {
    id: 'misinformation',
    label: 'Thông tin sai lệch',
    children: [
      { id: 'report-misinform-false', label: 'Tin giả rõ ràng' },
      { id: 'report-misinform-manipulated', label: 'Ảnh/video bị chỉnh sửa' },
      { id: 'report-misinform-conspiracy', label: 'Thuyết âm mưu' },
    ],
  },
  {
    id: 'other',
    label: 'Khác',
    children: [
      { id: 'report-other-irrelevant', label: 'Không liên quan nội dung' },
      { id: 'report-other-privacy', label: 'Vi phạm quyền riêng tư' },
      { id: 'report-other-other', label: 'Lý do khác' },
    ],
  },
];

// ----------------------------------------------------------------------

export const ReportSchema = zod.object({
  selectedItem: zod.string().min(1, { message: toastMessage.error.empty }),
  detailedReason: zod.string().optional(),
});

// ----------------------------------------------------------------------

export function CommentReportForm({ onClose, ...other }) {
  const dispatch = useDispatch();

  const { commentReport, product } = useSelector(selectProduct);

  const defaultValues = {
    detailedReason: '',
    selectedItem: '',
  };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(ReportSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const label = getLabelById(REPORT_OPTIONS, data.selectedItem);

      const body = {
        ratingId: commentReport?.id,
        customerId: commentReport?.customerId,
        reason: label,
        detailedReason: data.detailedReason || '',
      };

      await dispatch(
        reportCommentAsync({
          id: product?.id,
          ratingId: commentReport?.id,
          body,
        }),
      ).unwrap();

      toast.success('Báo cáo đã được gửi thành công!');

      reset();
      onClose();
    } catch (error) {
      console.error(error);
      if (error?.message === 'You have already reported this rating.') {
        toast.error('Bạn đã báo cáo đánh giá này trước đó.');
      }
    }
  });

  const onCancel = useCallback(() => {
    onClose();
    reset();
  }, [onClose, reset]);

  const getLabelById = useCallback(
    (items, id) =>
      items.reduce((result, item) => {
        if (result) return result;

        if (item.id === id) {
          return item.label;
        }

        if (item.children) {
          return getLabelById(item.children, id);
        }

        return null;
      }, null),
    [],
  );

  const handleSelectItem = useCallback(
    (event, itemId) => {
      setValue('selectedItem', itemId);
    },
    [setValue],
  );

  return (
    <Dialog onClose={onClose} {...other}>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle> Báo cáo đánh giá này </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <ComponentBlock title="Chủ đề báo cáo" sx={{ p: 1 }}>
              <SimpleTreeView
                sx={{ overflowX: 'hidden', minHeight: 240, width: 1 }}
                selectedItems={[values.selectedItem]}
                onSelectedItemsChange={handleSelectItem}
              >
                {REPORT_OPTIONS.map((group) => (
                  <TreeItem
                    itemId={group.id}
                    label={group.label}
                    key={group.id}
                  >
                    {group.children.map((child) => (
                      <TreeItem
                        itemId={child.id}
                        label={child.label}
                        key={child.id}
                      />
                    ))}
                  </TreeItem>
                ))}
              </SimpleTreeView>
            </ComponentBlock>

            <Field.Text
              name="detailedReason"
              label="Chi tiết"
              multiline
              rows={3}
              sx={{
                mt: 1,
                minWidth: {
                  xs: 300,
                  sm: 480,
                },
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onCancel}>
            Hủy
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={
              !values.selectedItem ||
              REPORT_OPTIONS.some((group) => group.id === values.selectedItem)
            }
          >
            Báo cáo
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
