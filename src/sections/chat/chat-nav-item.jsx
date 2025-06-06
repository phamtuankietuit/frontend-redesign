import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { fToNow } from 'src/utils/format-time';

import { selectChat } from 'src/state/chat/chat.slice';

// ----------------------------------------------------------------------

export function ChatNavItem({ selected, collapse, onCloseMobile, contact }) {
  const mdUp = useResponsive('up', 'md');

  const router = useRouter();

  const searchParams = useSearchParams();

  const selectedConversationId = searchParams.get('id') || '';

  const {
    name,
    avatarUrl,
    status,
    conversation,
    lastMessage: lastMsgOnContract,
  } = contact;

  const {
    admin: { lastMessage },
  } = useSelector(selectChat);

  const currentLastMessage =
    selectedConversationId === conversation._id
      ? lastMessage
      : lastMsgOnContract;

  const dispatch = useDispatch();

  const handleClickConversation = useCallback(async () => {
    try {
      if (selectedConversationId !== conversation._id) {
        if (!mdUp) {
          onCloseMobile();
        }

        // dispatch(setAdminContact(contact));

        router.push(`${paths.dashboard.chat}?id=${conversation._id}`);
      }
    } catch (error) {
      console.error(error);
    }
  }, [conversation._id, mdUp, onCloseMobile, router, selectedConversationId]);

  const renderSingle = (
    <Badge
      key={status}
      variant={status}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Avatar alt={name} src={avatarUrl} sx={{ width: 48, height: 48 }} />
    </Badge>
  );

  return (
    <Box component="li" sx={{ display: 'flex' }}>
      <ListItemButton
        onClick={handleClickConversation}
        sx={{
          py: 1.5,
          px: 2.5,
          gap: 2,
          ...(selected && { bgcolor: 'action.selected' }),
        }}
      >
        <Badge
          color="error"
          overlap="circular"
          badgeContent={collapse ? conversation.adminUnreadCount : 0}
        >
          {renderSingle}
        </Badge>

        {!collapse && (
          <>
            <ListItemText
              primary={name}
              primaryTypographyProps={{
                noWrap: true,
                component: 'span',
                variant: 'subtitle2',
              }}
              secondary={currentLastMessage?.body}
              secondaryTypographyProps={{
                noWrap: true,
                component: 'span',
                variant: 'body2',
                color: 'text.secondary',
              }}
            />

            <Stack alignItems="flex-end" sx={{ alignSelf: 'stretch' }}>
              <Typography
                noWrap
                variant="body2"
                component="span"
                sx={{ mb: 1.5, fontSize: 12, color: 'text.disabled' }}
              >
                {fToNow(currentLastMessage?.createdAt)}
              </Typography>

              {/* {!!conversation.adminUnreadCount && (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    bgcolor: 'info.main',
                    borderRadius: '50%',
                  }}
                />
              )} */}
            </Stack>
          </>
        )}
      </ListItemButton>
    </Box>
  );
}
