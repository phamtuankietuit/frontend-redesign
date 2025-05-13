import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import { Grow, Badge } from '@mui/material';

import { useSocket } from 'src/hooks/use-socket';
import { useBoolean } from 'src/hooks/use-boolean';

import { selectAuth } from 'src/state/auth/auth.slice';
import {
  getConversationAsync,
  updateConversationReadAsync,
} from 'src/services/chat/chat.service';
import {
  selectChat,
  addNewMessageSocket,
  increaseUnreadCount,
} from 'src/state/chat/chat.slice';

import { Iconify } from 'src/components/iconify';

import { Layout } from 'src/sections/chat/layout';
import { CustomerChatMessageList } from 'src/sections/chat/customer-chat-message-list';
import { CustomerChatHeaderDetail } from 'src/sections/chat/customer-header-chat-detail';
import { CustomerChatMessageInput } from 'src/sections/chat/customer-chat-message-input';

// ----------------------------------------------------------------------

export function ChatIcon() {
  const dispatch = useDispatch();

  const { user } = useSelector(selectAuth);

  const { conversation, messages } = useSelector(selectChat);

  const messageSocket = useSocket('message');

  const isOpen = useBoolean(false);

  const handleClose = () => {
    isOpen.onFalse();
  };

  const handleOpen = () => {
    isOpen.onTrue();

    if (conversation) {
      dispatch(
        updateConversationReadAsync({
          conversationReadId: conversation?.conversationReadId,
          lastReadMessageId: messages[messages.length - 1]?.id,
        }),
      );
    }
  };

  useEffect(() => {
    dispatch(getConversationAsync(user.id));
  }, [user, dispatch]);

  useEffect(() => {
    if (messageSocket) {
      if (messageSocket?.assignee?.id === user.id) {
        dispatch(addNewMessageSocket(messageSocket));

        if (isOpen.value) {
          dispatch(
            updateConversationReadAsync({
              conversationReadId: conversation?.conversationReadId,
              lastReadMessageId: messageSocket?.id,
            }),
          );
        } else {
          dispatch(increaseUnreadCount());
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageSocket]);

  return (
    <Box>
      <Grow in={!isOpen.value} style={{ transformOrigin: 'left top' }}>
        <Box
          onClick={handleOpen}
          sx={{
            right: 40,
            bottom: 40,
            zIndex: 999,
            position: 'fixed',
            width: 'fit-content',
            display: 'flex',
            cursor: 'pointer',
            color: 'text.primary',
            borderRadius: 16,
            bgcolor: 'background.paper',
            padding: (theme) => theme.spacing(2, 2, 2, 2),
            boxShadow: (theme) => theme.customShadows.dropdown,
            transition: (theme) => theme.transitions.create(['opacity']),
            '&:hover': { opacity: 0.72 },
          }}
        >
          <Badge
            color="error"
            overlap="rectangular"
            badgeContent={conversation?.unreadCount}
          >
            <Iconify icon="solar:chat-line-bold" width={24} />
          </Badge>
        </Box>
      </Grow>

      <Grow in={isOpen.value} style={{ transformOrigin: 'right bottom' }}>
        <Box
          sx={{
            right: 40,
            bottom: 40,
            zIndex: 999,
            position: 'fixed',
          }}
        >
          <Layout
            sx={{
              height: 500,
              width: 500,
              borderRadius: 2,
              bgcolor: 'background.paper',
              boxShadow: (theme) => theme.customShadows.card,
            }}
            slots={{
              header: <CustomerChatHeaderDetail onClose={handleClose} />,
              main: (
                <>
                  <CustomerChatMessageList />

                  <CustomerChatMessageInput />
                </>
              ),
            }}
          />
        </Box>
      </Grow>
    </Box>
  );
}
