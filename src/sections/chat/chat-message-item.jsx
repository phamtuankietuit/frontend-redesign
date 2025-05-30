import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { fToNow } from 'src/utils/format-time';

import { selectChat } from 'src/state/chat/chat.slice';
import { selectAuth } from 'src/state/auth/auth.slice';

// ----------------------------------------------------------------------

export function ChatMessageItem({ message, onOpenLightbox }) {
  const { body, senderId, createdAt, hasImage } = message;

  const {
    admin: { contact },
  } = useSelector(selectChat);

  const { id: contactId, name: contactFullName } = contact;

  const { user } = useSelector(selectAuth);

  const { fullName: userFullName } = user;

  const renderInfo = (
    <Typography
      noWrap
      variant="caption"
      sx={{
        mb: 1,
        color: 'text.disabled',
        ...(contactId.toString() !== senderId && { mr: 'auto' }),
      }}
    >
      {contactId.toString() === senderId && `${contactFullName}, `}
      {contactId.toString() !== senderId && `${userFullName}, `}

      {fToNow(createdAt)}
    </Typography>
  );

  const renderBody = (
    <Stack
      sx={{
        p: 1.5,
        minWidth: 48,
        maxWidth: 320,
        borderRadius: 1,
        typography: 'body2',
        bgcolor: 'background.neutral',
        ...(contactId.toString() !== senderId && {
          color: 'grey.800',
          bgcolor: 'primary.lighter',
        }),
        ...(hasImage && { p: 0, bgcolor: 'transparent' }),
      }}
    >
      {hasImage ? (
        <Box
          component="img"
          alt="attachment"
          src={body}
          onClick={() => onOpenLightbox(body)}
          sx={{
            width: 400,
            height: 'auto',
            borderRadius: 1.5,
            cursor: 'pointer',
            objectFit: 'cover',
            aspectRatio: '16/11',
            '&:hover': { opacity: 0.9 },
          }}
        />
      ) : (
        body
      )}
    </Stack>
  );

  if (!message.body) {
    return null;
  }

  return (
    <Stack
      direction="row"
      justifyContent={contactId.toString() !== senderId ? 'flex-end' : 'unset'}
      sx={{ mb: 5 }}
    >
      {contactId.toString() === senderId && (
        <Avatar
          alt={contact?.name}
          src={contact?.avatarUrl}
          sx={{ width: 32, height: 32, mr: 2 }}
        />
      )}

      <Stack
        alignItems={
          contactId.toString() !== senderId ? 'flex-end' : 'flex-start'
        }
      >
        {renderInfo}

        <Stack
          direction="row"
          alignItems="center"
          sx={{
            position: 'relative',
            '&:hover': { '& .message-actions': { opacity: 1 } },
          }}
        >
          {renderBody}
        </Stack>
      </Stack>
    </Stack>
  );
}
