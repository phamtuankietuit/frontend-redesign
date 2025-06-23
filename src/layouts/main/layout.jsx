import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { _notifications } from 'src/_mock';
import { selectAuth } from 'src/state/auth/auth.slice';
import { getMeAsync } from 'src/services/auth/auth.service';
import { selectProductType } from 'src/state/product-type/product-type.slice';
import { getProductTypesAsync } from 'src/services/product-type/product-type.service';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';
import { FormControlLabel, IconButton, Switch, Tooltip } from '@mui/material';
import { selectSearch, setMode } from 'src/state/search/search.slice';
import { paths } from 'src/routes/paths';

import { Main } from './main';
import { NavMobile } from './nav/mobile';
import { NavDesktop } from './nav/desktop';
import { Footer } from './footer';
import { _account } from '../config-nav-account';
import { getConfigNavMain } from '../config-nav-main';
import { MenuButton } from '../components/menu-button';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';
import { SignInButton } from '../components/sign-in-button';
import { AccountDrawer } from '../components/account-drawer';
import { SettingsButton } from '../components/settings-button';
import { SearchHome } from '../components/search-home/search-home';
import { NotificationsDrawer } from '../components/notifications-drawer';

// ----------------------------------------------------------------------

export function MainLayout({ sx, data, children, header }) {
  const theme = useTheme();

  const mobileNavOpen = useBoolean();

  const layoutQuery = 'sm';

  const router = useRouter();

  const dispatch = useDispatch();

  const { user } = useSelector(selectAuth);

  const { productTypes } = useSelector(selectProductType);

  const { mode } = useSelector(selectSearch);

  useEffect(() => {
    if (productTypes.length === 0) {
      dispatch(getProductTypesAsync());
    }

    if (!user) {
      dispatch(getMeAsync());
    }
  }, [dispatch, productTypes, user]);

  const navData = getConfigNavMain(productTypes);

  return (
    <LayoutSection
      /** **************************************
       * Header
       *************************************** */
      headerSection={
        <HeaderSection
          layoutQuery={layoutQuery}
          sx={header?.sx}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
            leftArea: (
              <>
                {/* -- Nav mobile -- */}
                <MenuButton
                  onClick={mobileNavOpen.onTrue}
                  sx={{
                    mr: 1,
                    ml: -1,
                    [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
                  }}
                />
                <NavMobile
                  data={navData}
                  open={mobileNavOpen.value}
                  onClose={mobileNavOpen.onFalse}
                />
                {/* -- Logo -- */}
                <Logo />
              </>
            ),
            centerArea: (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexGrow: 1,
                }}
              >
                {/* -- Nav desktop -- */}
                <NavDesktop
                  data={navData}
                  sx={{
                    display: 'none',
                    [theme.breakpoints.up(layoutQuery)]: {
                      mr: 2.5,
                      display: 'flex',
                    },
                  }}
                />

                <SearchHome />
              </Box>
            ),
            rightArea: (
              <Box
                display="flex"
                alignItems="center"
                gap={{ xs: 0, sm: 0.75, md: 1.25 }}
              >
                {/* {user && <NotificationsDrawer data={_notifications} />} */}
                <SettingsButton />
                {!user && <SignInButton />}
                {user && <AccountDrawer data={_account} />}
              </Box>
            ),
          }}
        />
      }
      /** **************************************
       * Footer
       *************************************** */
      footerSection={<Footer layoutQuery={layoutQuery} />}
      /** **************************************
       * Style
       *************************************** */
      sx={sx}
    >
      <Main>{children}</Main>
    </LayoutSection>
  );
}
