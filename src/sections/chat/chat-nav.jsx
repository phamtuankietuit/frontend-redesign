import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { ToggleButton } from './styles';
import { ChatNavItem } from './chat-nav-item';
import { ChatNavItemSkeleton } from './chat-skeleton';

// ----------------------------------------------------------------------

const NAV_WIDTH = 320;

const NAV_COLLAPSE_WIDTH = 96;

export function ChatNav({
  loading,
  contacts,
  collapseNav,
  selectedConversationId,
}) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const {
    openMobile,
    onOpenMobile,
    onCloseMobile,
    onCloseDesktop,
    collapseDesktop,
    onCollapseDesktop,
  } = collapseNav;

  const [searchContacts, setSearchContacts] = useState({
    query: '',
    results: [],
  });

  useEffect(() => {
    if (!mdUp) {
      onCloseDesktop();
    }
  }, [onCloseDesktop, mdUp]);

  const handleToggleNav = useCallback(() => {
    if (mdUp) {
      onCollapseDesktop();
    } else {
      onCloseMobile();
    }
  }, [mdUp, onCloseMobile, onCollapseDesktop]);

  const handleClickCompose = useCallback(() => {
    if (!mdUp) {
      onCloseMobile();
    }
    router.push(paths.dashboard.chat);
  }, [mdUp, onCloseMobile, router]);

  const handleSearchContacts = useCallback(
    (inputValue) => {
      setSearchContacts((prevState) => ({ ...prevState, query: inputValue }));

      if (inputValue) {
        const results = contacts.filter((contact) =>
          contact.name.toLowerCase().includes(inputValue),
        );

        setSearchContacts((prevState) => ({ ...prevState, results }));
      }
    },
    [contacts],
  );

  const handleClickAwaySearch = useCallback(() => {
    setSearchContacts({ query: '', results: [] });
  }, []);

  // const handleClickResult = useCallback(
  //   async (result) => {
  //     handleClickAwaySearch();

  //     const linkTo = (id) => router.push(`${paths.dashboard.chat}?id=${id}`);

  //     try {
  //       // Check if the conversation already exists
  //       if (conversations.allIds.includes(result.id)) {
  //         linkTo(result.id);
  //         return;
  //       }

  //       // Find the recipient in contacts
  //       const recipient = contacts.find((contact) => contact.id === result.id);
  //       if (!recipient) {
  //         console.error('Recipient not found');
  //         return;
  //       }

  //       // Prepare conversation data
  //       const { conversationData } = initialConversation({
  //         recipients: [recipient],
  //         me: myContact,
  //       });

  //       // Create a new conversation
  //       const res = await createConversation(conversationData);

  //       if (!res || !res.conversation) {
  //         console.error('Failed to create conversation');
  //       }

  //       // Navigate to the new conversation
  //       linkTo(res.conversation.id);
  //     } catch (error) {
  //       console.error('Error handling click result:', error);
  //     }
  //   },
  //   [contacts, conversations.allIds, handleClickAwaySearch, myContact, router],
  // );

  const renderLoading = <ChatNavItemSkeleton />;

  const renderList = (
    <nav>
      <Box component="ul">
        {contacts?.map((contact) => (
          <ChatNavItem
            key={contact.id}
            collapse={collapseDesktop}
            conversation={contact.conversation}
            selected={contact.conversation.id === selectedConversationId}
            onCloseMobile={onCloseMobile}
            contact={contact}
          />
        ))}
      </Box>
    </nav>
  );

  // const renderListResults = (
  //   <ChatNavSearchResults
  //     query={searchContacts.query}
  //     results={searchContacts.results}
  //     onClickResult={() => {}}
  //   />
  // );

  const renderSearchInput = (
    <ClickAwayListener onClickAway={handleClickAwaySearch}>
      <TextField
        fullWidth
        value={searchContacts.query}
        onChange={() => {}}
        placeholder="Tìm khách hàng..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
        sx={{ mt: 2.5 }}
      />
    </ClickAwayListener>
  );

  const renderContent = (
    <>
      {/* <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{ p: 2.5, pb: 0 }}
      >
        {!collapseDesktop && (
          <>
            <ChatNavAccount />
            <Box sx={{ flexGrow: 1 }} />
          </>
        )}

        <IconButton onClick={handleToggleNav}>
          <Iconify
            icon={
              collapseDesktop
                ? 'eva:arrow-ios-forward-fill'
                : 'eva:arrow-ios-back-fill'
            }
          />
        </IconButton>

        {!collapseDesktop && (
          <IconButton onClick={handleClickCompose}>
            <Iconify width={24} icon="solar:user-plus-bold" />
          </IconButton>
        )}
      </Stack> */}

      <Box sx={{ p: 2.5, pt: 0 }}>{!collapseDesktop && renderSearchInput}</Box>

      {loading ? (
        renderLoading
      ) : (
        <Scrollbar sx={{ pb: 1 }}>
          {renderList}
          {/* {searchContacts.query && !!conversations.allIds.length
            ? renderListResults
            : renderList} */}
        </Scrollbar>
      )}
    </>
  );

  return (
    <>
      <ToggleButton onClick={onOpenMobile} sx={{ display: { md: 'none' } }}>
        <Iconify width={16} icon="solar:users-group-rounded-bold" />
      </ToggleButton>

      <Stack
        sx={{
          minHeight: 0,
          flex: '1 1 auto',
          width: NAV_WIDTH,
          display: { xs: 'none', md: 'flex' },
          borderRight: (theme) => `solid 1px ${theme.vars.palette.divider}`,
          transition: (theme) =>
            theme.transitions.create(['width'], {
              duration: theme.transitions.duration.shorter,
            }),
          ...(collapseDesktop && { width: NAV_COLLAPSE_WIDTH }),
        }}
      >
        {renderContent}
      </Stack>

      <Drawer
        open={openMobile}
        onClose={onCloseMobile}
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: NAV_WIDTH } }}
      >
        {renderContent}
      </Drawer>
    </>
  );
}
