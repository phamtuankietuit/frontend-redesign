import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';

import { selectAuth } from 'src/state/auth/auth.slice';
import { ChatIcon } from 'src/sections/product/components/chat-icon';
import { BackToTop } from 'src/components/animate';
import { CartIcon } from 'src/sections/product/components/cart-icon';
import { layoutClasses } from '../classes';

// ----------------------------------------------------------------------

export function Main({ children, sx, ...other }) {
  const { user } = useSelector(selectAuth);

  return (
    <Box
      component="main"
      className={layoutClasses.main}
      sx={{
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        ...sx,
      }}
      {...other}
    >
      {user && <CartIcon />}

      <BackToTop
        value={5}
        sx={{
          right: { xs: 44, md: 46 },
          bottom: { xs: 102, md: 112 },
          zIndex: 99,
        }}
      />

      {user && <ChatIcon />}

      {children}
    </Box>
  );
}
