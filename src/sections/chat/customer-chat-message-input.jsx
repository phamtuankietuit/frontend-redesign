import { useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Stack from '@mui/material/Stack';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import { Chip, CircularProgress } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { selectAuth } from 'src/state/auth/auth.slice';
import { selectChat } from 'src/state/chat/chat.slice';
import { getAccessToken } from 'src/services/token.service';
import { uploadImagesAsync } from 'src/services/file/file.service';
import {
  getMessagesAsync,
  createMessageAsync,
} from 'src/services/chat/chat.service';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function CustomerChatMessageInput({ disabled }) {
  const dispatch = useDispatch();

  const { user } = useSelector(selectAuth);

  const { conversation, tableFiltersMessages } = useSelector(selectChat);

  const fileRef = useRef(null);

  const [message, setMessage] = useState('');

  const handleAttach = useCallback(() => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, []);

  const handleChangeMessage = useCallback((event) => {
    setMessage(event.target.value);
  }, []);

  const handleSendMessage = useCallback(
    async (event) => {
      if (event.key !== 'Enter' || !message) return;

      try {
        await dispatch(
          createMessageAsync({
            conversationId: conversation.id,
            customerId: user.id,
            body: message,
          }),
        ).unwrap();
      } catch (error) {
        console.error(error);
      } finally {
        setMessage('');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [message, conversation._id, dispatch],
  );

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      await dispatch(uploadImagesAsync([file]))
        .unwrap()
        .then((urls) => {
          dispatch(
            createMessageAsync({
              conversationId: conversation.id,
              contentType: 'image',
              customerId: user.id,
              body: urls[0],
            }),
          ).then(() => {
            dispatch(
              getMessagesAsync({
                conversationId: conversation.id,
                ...tableFiltersMessages,
              }),
            );
          });
        });
    }
  };

  const branchAddressLoading = useBoolean(false);

  const handleClickBranchAddress = useCallback(async () => {
    const accessToken = getAccessToken();

    if (accessToken) {
      branchAddressLoading.onTrue();

      await dispatch(
        createMessageAsync({
          conversationId: conversation.id,
          customerId: user.id,
          body: 'Địa chỉ các chi nhánh?',
          isBranchAddressQuery: true,
          token: accessToken,
        }),
      ).unwrap();

      branchAddressLoading.onFalse();
    }
  }, [conversation.id, dispatch, user.id, branchAddressLoading]);

  return (
    <>
      <Stack
        direction="row"
        sx={{
          px: 1,
          flexShrink: 0,
          borderTop: (theme) => `solid 1px ${theme.vars.palette.divider}`,
          overflowX: 'auto',
          py: 1,
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
        alignItems="center"
        spacing={1}
      >
        <Chip variant="soft" clickable label="Gửi sản phẩm đang xem?" />
        <Chip
          variant="soft"
          clickable
          label="Địa chỉ các chi nhánh?"
          icon={
            branchAddressLoading.value ? <CircularProgress size={14} /> : null
          }
          onClick={handleClickBranchAddress}
        />
      </Stack>

      <InputBase
        name="chat-message"
        id="chat-message-input"
        value={message}
        onKeyUp={handleSendMessage}
        onChange={handleChangeMessage}
        placeholder="Nhập tin nhắn"
        disabled={disabled}
        startAdornment={
          <IconButton>
            <Iconify icon="solar:chat-line-bold" />
          </IconButton>
        }
        endAdornment={
          <Stack direction="row" sx={{ flexShrink: 0 }}>
            <IconButton onClick={handleAttach}>
              <Iconify icon="solar:gallery-add-bold" />
            </IconButton>
          </Stack>
        }
        sx={{
          px: 1,
          height: 56,
          flexShrink: 0,
          borderTop: (theme) => `solid 1px ${theme.vars.palette.divider}`,
        }}
      />

      <input
        type="file"
        ref={fileRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </>
  );
}
