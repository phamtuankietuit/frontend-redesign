import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { IconButton, Stack, Tooltip } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { toast } from 'sonner';

import { Scrollbar } from 'src/components/scrollbar';
import {
  TableHeadCustom,
  TableSelectedAction,
  TableSkeleton,
} from 'src/components/table';

import { CustomPopover } from 'src/components/custom-popover';
import {
  getCartItemsAsync,
  updateCartItemsAsync,
} from 'src/services/cart/cart.service';
import {
  onSelectAllRows,
  onSelectRow,
  resetSelection,
  selectCart,
} from 'src/state/cart/cart.slice';
import { UPDATE_CART_ACTION_TYPE } from './constants';
import { CheckoutCartProduct } from './checkout-cart-product';
import { VariantsForm } from './variants-form';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'product', label: 'Sản phẩm' },
  { id: 'price', label: 'Giá' },
  { id: 'quantity', label: 'Số lượng' },
  { id: 'totalAmount', label: 'Tổng tiền', align: 'right' },
  { id: '' },
];

// ----------------------------------------------------------------------

export function CheckoutCartProductList() {
  const dispatch = useDispatch();

  const isFirstRender = useRef(true);

  const { items, selectedRowIds, loading } = useSelector(selectCart);

  const [rowPopover, setRowPopover] = useState(null);

  const handleDelete = useCallback(
    async (id) => {
      try {
        const body = {
          selectedItemIds: selectedRowIds.filter(
            (selectedId) => selectedId !== id,
          ),
          actionType: UPDATE_CART_ACTION_TYPE.REMOVE,
          updateItems: [
            {
              id,
            },
          ],
        };

        await dispatch(updateCartItemsAsync(body)).unwrap();

        // Remove from selectedRowIds if it was selected
        if (selectedRowIds.includes(id)) {
          dispatch(onSelectRow(id));
        }

        dispatch(getCartItemsAsync());

        toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Có lỗi xảy ra khi xóa sản phẩm khỏi giỏ!');
      }
    },
    [dispatch, selectedRowIds],
  );

  const handleDeleteSelectedRows = useCallback(async () => {
    try {
      if (selectedRowIds.length > 0) {
        const body = {
          actionType: UPDATE_CART_ACTION_TYPE.REMOVE,
          updateItems: selectedRowIds.map((id) => ({
            id,
          })),
        };

        await dispatch(updateCartItemsAsync(body)).unwrap();

        await dispatch(resetSelection()).unwrap();

        await dispatch(getCartItemsAsync()).unwrap();

        toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
      }
    } catch (error) {
      console.error('Error deleting selected rows:', error);
      toast.error('Có lỗi xảy ra khi xóa sản phẩm khỏi giỏ!');
    }
  }, [dispatch, selectedRowIds]);

  const handleSelectRow = useCallback(
    (inputValue) => {
      dispatch(onSelectRow(inputValue));
    },
    [dispatch],
  );

  const handleOpenRowPopover = useCallback((event, row) => {
    setRowPopover({
      anchorEl: event.currentTarget,
      row,
    });
  }, []);

  const handleCloseRowPopover = useCallback(() => {
    setRowPopover(null);
  }, []);

  const handleIncrease = useCallback(
    async (row) => {
      const body = {
        selectedItemIds: selectedRowIds,
        actionType: UPDATE_CART_ACTION_TYPE.UPDATE_QUANTITY,
        updateItems: [
          {
            id: row.id,
            quantity: row.quantity + 1,
            oldQuantity: row.quantity,
          },
        ],
      };

      await dispatch(updateCartItemsAsync(body)).unwrap();
    },
    [dispatch, selectedRowIds],
  );

  const handleDecrease = useCallback(
    async (row) => {
      if (row.quantity <= 1) {
        return;
      }

      const body = {
        selectedItemIds: selectedRowIds,
        actionType: UPDATE_CART_ACTION_TYPE.UPDATE_QUANTITY,
        updateItems: [
          {
            id: row.id,
            quantity: row.quantity - 1,
            oldQuantity: row.quantity,
          },
        ],
      };

      await dispatch(updateCartItemsAsync(body)).unwrap();
    },
    [dispatch, selectedRowIds],
  );

  useEffect(() => {
    dispatch(resetSelection());
  }, [dispatch]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const body = {
      actionType: UPDATE_CART_ACTION_TYPE.SELECT_FOR_CHECKOUT,
      selectedItemIds: selectedRowIds,
    };

    dispatch(updateCartItemsAsync(body));
  }, [selectedRowIds, dispatch]);

  return (
    <Scrollbar>
      <TableSelectedAction
        sx={{
          minWidth: 720,
        }}
        rowCount={items.length}
        numSelected={selectedRowIds.length}
        onSelectAllRows={(checked) => {
          dispatch(
            onSelectAllRows({
              checked,
              inputValue: items
                .filter((row) => row.totalQuantity >= row.quantity)
                .map((row) => row.id),
            }),
          );
        }}
        action={
          <Stack direction="row">
            <Tooltip title="Xóa">
              <IconButton color="primary" onClick={handleDeleteSelectedRows}>
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Tooltip>
          </Stack>
        }
      />
      <Table sx={{ minWidth: 720 }}>
        <TableHeadCustom
          headLabel={TABLE_HEAD}
          rowCount={items.length}
          numSelected={selectedRowIds.length}
          onSelectAllRows={(checked) => {
            dispatch(
              onSelectAllRows({
                checked,
                inputValue: items
                  .filter((row) => row.totalQuantity >= row.quantity)
                  .map((row) => row.id),
              }),
            );
          }}
        />
        <TableBody>
          {items.map((row) => (
            <CheckoutCartProduct
              key={row.id}
              row={row}
              selected={selectedRowIds.includes(row.id)}
              onDelete={() => handleDelete(row.id)}
              onSelectRow={() => handleSelectRow(row.id)}
              onIncrease={() => handleIncrease(row)}
              onDecrease={() => handleDecrease(row)}
              onPopoverOpen={(event) => handleOpenRowPopover(event, row)}
            />
          ))}

          {loading &&
            [...Array(5)].map((_, index) => <TableSkeleton key={index} />)}
        </TableBody>
      </Table>

      <CustomPopover
        open={Boolean(rowPopover)}
        anchorEl={rowPopover?.anchorEl}
        onClose={handleCloseRowPopover}
      >
        <VariantsForm row={rowPopover?.row} onClose={handleCloseRowPopover} />
      </CustomPopover>
    </Scrollbar>
  );
}
