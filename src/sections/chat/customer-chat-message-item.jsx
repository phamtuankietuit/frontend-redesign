import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { fToNow } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';
import { selectAuth } from 'src/state/auth/auth.slice';

// ----------------------------------------------------------------------

export function CustomerChatMessageItem({ message, onOpenLightbox }) {
  const { user } = useSelector(selectAuth);

  const { body, createdAt, customerId } = message;

  const renderInfo = (
    <Typography
      noWrap
      variant="caption"
      sx={{
        mb: 1,
        color: 'text.disabled',
        ...(!customerId && { mr: 'auto' }),
      }}
    >
      {!customerId && `KKBooks, `}

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
        ...(customerId && {
          color: 'grey.800',
          bgcolor: 'primary.lighter',
        }),
        ...(message?.contentType === 'image' && {
          p: 0,
          bgcolor: 'transparent',
        }),
      }}
    >
      {message?.contentType === 'image' ? (
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
      justifyContent={customerId ? 'flex-end' : 'unset'}
      sx={{ mb: 5 }}
    >
      {!customerId && (
        <Avatar
          alt="KKBooks"
          src={`${CONFIG.assetsDir}/logo/my-logo-single.svg`}
          sx={{ width: 32, height: 32, mr: 2 }}
        />
      )}

      <Stack alignItems={customerId ? 'flex-end' : 'flex-start'}>
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
