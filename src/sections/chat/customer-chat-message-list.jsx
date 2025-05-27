import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import LinearProgress from '@mui/material/LinearProgress';

import { getMessagesAsync } from 'src/services/chat/chat.service';
import { selectChat, setTableFiltersMessages } from 'src/state/chat/chat.slice';

import { Scrollbar } from 'src/components/scrollbar';
import { Lightbox, useLightBox } from 'src/components/lightbox';

import { useMessagesScroll } from './hooks/use-messages-scroll';
import { CustomerChatMessageItem } from './customer-chat-message-item';

// ----------------------------------------------------------------------

export function CustomerChatMessageList() {
  const {
    conversation,
    messages,
    tableFiltersMessages,
    loading,
    totalPages,
    mIsEnd,
  } = useSelector(selectChat);

  const { messagesRef, isAtTop } = useMessagesScroll(messages);

  const dispatch = useDispatch();

  const slides = messages
    .filter((message) => message.contentType === 'image')
    .map((message) => ({ src: message.body }));

  const lightbox = useLightBox(slides);

  useEffect(() => {
    if (isAtTop && messages.length > 0 && !mIsEnd) {
      dispatch(
        setTableFiltersMessages({
          fromId: messages[0].id,
        }),
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAtTop]);

  useEffect(() => {
    if (conversation?.id) {
      dispatch(
        getMessagesAsync({
          conversationId: conversation.id,
          ...tableFiltersMessages,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation, tableFiltersMessages]);

  return (
    <>
      <Scrollbar
        key={conversation._id}
        ref={messagesRef}
        sx={{ px: 3, pt: 5, pb: 3, flex: '1 1 auto' }}
      >
        {(isAtTop || loading) &&
          tableFiltersMessages.pageNumber < totalPages && (
            <LinearProgress
              color="primary"
              sx={{
                top: 0,
                left: 0,
                width: 1,
                height: 2,
                borderRadius: 0,
                position: 'absolute',
              }}
            />
          )}

        {messages.map((message, index) => (
          <CustomerChatMessageItem
            key={`${message.id}-${index}`}
            message={message}
            onOpenLightbox={() => lightbox.onOpen(message.body)}
          />
        ))}
      </Scrollbar>

      <Lightbox
        slides={slides}
        open={lightbox.open}
        close={lightbox.onClose}
        index={lightbox.selected}
      />
    </>
  );
}
