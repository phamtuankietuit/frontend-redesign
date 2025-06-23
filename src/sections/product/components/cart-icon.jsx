import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { resetSelection, selectCart } from 'src/state/cart/cart.slice';
import { getCartItemsAsync } from 'src/services/cart/cart.service';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function CartIcon() {
  const dispatch = useDispatch();

  const { items } = useSelector(selectCart);

  const totalItems = items.length;

  useEffect(() => {
    dispatch(getCartItemsAsync());
  }, [dispatch]);

  const handleCartClick = () => {
    dispatch(resetSelection());
  };

  return (
    <Box
      component={RouterLink}
      href={paths.cart.root}
      sx={{
        right: 0,
        top: 112,
        zIndex: 999,
        display: 'flex',
        cursor: 'pointer',
        position: 'fixed',
        color: 'text.primary',
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
        bgcolor: 'background.paper',
        padding: (theme) => theme.spacing(1, 3, 1, 2),
        boxShadow: (theme) => theme.customShadows.dropdown,
        transition: (theme) => theme.transitions.create(['opacity']),
        '&:hover': { opacity: 0.72 },
      }}
      onClick={handleCartClick}
    >
      <Badge showZero badgeContent={totalItems || 0} color="error" max={99}>
        <Iconify icon="solar:cart-3-bold" width={24} />
      </Badge>
    </Box>
  );
}
