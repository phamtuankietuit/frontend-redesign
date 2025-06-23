import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import { CircularProgress } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';

import { useBoolean } from 'src/hooks/use-boolean';

import { selectAuth } from 'src/state/auth/auth.slice';
import { selectAddress, setAddress } from 'src/state/address/address.slice';
import { nextStep, pickAddress } from 'src/state/cart/cart.slice';
import {
  getWardsAsync,
  getAddressesAsync,
  getDistrictsAsync,
  getProvincesAsync,
  createAddressAsync,
  deleteAddressAsync,
  updateAddressAsync,
} from 'src/services/address/address.service';

import { usePathname } from 'src/routes/hooks';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { AddressItem, AddressNewForm } from '../address';

// ----------------------------------------------------------------------

export function AccountBillingAddress() {
  const dispatch = useDispatch();

  const { user } = useSelector(selectAuth);

  const { addresses } = useSelector(selectAddress);

  const [addressId, setAddressId] = useState('');

  const popover = usePopover();

  const addressForm = useBoolean();

  const confirm = useBoolean();

  const handleAddNewAddress = useCallback(
    async (address) => {
      try {
        if (address.id) {
          await dispatch(
            updateAddressAsync({
              userId: user.id,
              id: address.id,
              body: address,
            }),
          ).unwrap();
          toast.success('Cập nhật địa chỉ thành công');
        } else {
          await dispatch(
            createAddressAsync({ id: user.id, body: address }),
          ).unwrap();
          toast.success('Thêm địa chỉ thành công');
        }

        await dispatch(getAddressesAsync(user.id)).unwrap();
      } catch (error) {
        console.error(error);
        toast.error('Có lỗi xảy ra, vui lòng thử lại');
      }
    },
    [dispatch, user],
  );

  const handleSelectedId = useCallback(
    (event, id) => {
      popover.onOpen(event);
      setAddressId(id);
    },
    [popover],
  );

  const handleClose = useCallback(() => {
    popover.onClose();
    setAddressId('');
  }, [popover]);

  useEffect(() => {
    if (user) {
      dispatch(getAddressesAsync(user.id));
    }
  }, [dispatch, user]);

  const [loadingEditAddress, setLoadingEditAddress] = useState(false);

  const handleClickEditAddress = async () => {
    setLoadingEditAddress(true);

    const selectedAddress = addresses.find(
      (address) => address.id === addressId,
    );

    await dispatch(getProvincesAsync()).unwrap();
    await dispatch(getDistrictsAsync(selectedAddress.provinceId)).unwrap();
    await dispatch(getWardsAsync(selectedAddress.districtId)).unwrap();
    dispatch(setAddress(selectedAddress));

    setLoadingEditAddress(false);
    handleClose();
    addressForm.onTrue();
  };

  const loadingDeleteAddress = useBoolean(false);

  const handleDeleteAddress = async () => {
    try {
      loadingDeleteAddress.onTrue();

      await dispatch(
        deleteAddressAsync({ userId: user.id, id: addressId }),
      ).unwrap();

      await dispatch(getAddressesAsync(user.id)).unwrap();

      toast.success('Xóa địa chỉ thành công');

      confirm.onFalse();
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      loadingDeleteAddress.onFalse();
    }
  };

  const pathName = usePathname();

  const isCheckoutPage = pathName.includes('/cart');

  const handleSelectAddress = useCallback(
    (address) => {
      dispatch(pickAddress(address));
      dispatch(nextStep());
    },
    [dispatch],
  );

  return (
    <>
      <Card>
        <CardHeader
          title="Địa chỉ"
          action={
            <Button
              size="small"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={addressForm.onTrue}
            >
              Thêm mới
            </Button>
          }
        />

        <Stack spacing={2.5} sx={{ p: 3 }}>
          {addresses?.length === 0 && (
            <EmptyContent title="Không có dữ liệu" filled sx={{ py: 10 }} />
          )}
          {addresses?.map((address) => (
            <AddressItem
              variant="outlined"
              key={address.id}
              address={address}
              action={
                <>
                  <IconButton
                    onClick={(event) => {
                      handleSelectedId(event, address.id);
                    }}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                  >
                    <Iconify icon="eva:more-vertical-fill" />
                  </IconButton>

                  {isCheckoutPage && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleSelectAddress(address)}
                    >
                      Giao đến địa chỉ này
                    </Button>
                  )}
                </>
              }
              sx={{ p: 2.5, borderRadius: 1 }}
            />
          ))}
        </Stack>
      </Card>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={handleClose}
      >
        <MenuList>
          <MenuItem onClick={handleClickEditAddress}>
            {loadingEditAddress ? (
              <CircularProgress size={16} thickness={4} color="inherit" />
            ) : (
              <Iconify icon="solar:pen-bold" />
            )}
            Chỉnh sửa
          </MenuItem>

          <MenuItem
            onClick={() => {
              confirm.onTrue();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Xóa
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <AddressNewForm
        open={addressForm.value}
        onClose={addressForm.onFalse}
        onCreate={handleAddNewAddress}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Xóa"
        content={<>Bạn có chắc chắn muốn xóa địa chỉ này không?</>}
        action={
          <LoadingButton
            variant="contained"
            color="error"
            onClick={handleDeleteAddress}
            loading={loadingDeleteAddress.value}
          >
            Xóa
          </LoadingButton>
        }
      />
    </>
  );
}
