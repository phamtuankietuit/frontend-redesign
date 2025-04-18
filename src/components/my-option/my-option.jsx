import { Controller } from 'react-hook-form';

import Box from '@mui/material/Box';

import { varAlpha } from 'src/theme/styles';

// ----------------------------------------------------------------------

export default function MyOption({ name, control, values }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <Box
          columnGap={2}
          rowGap={2.5}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          }}
        >
          {values?.map((option) => (
            <OptionItem
              key={option.id}
              option={option}
              selected={value?.id === option?.id}
              onClick={() => {
                onChange(option);
              }}
            />
          ))}
        </Box>
      )}
    />
  );
}

// ----------------------------------------------------------------------

function OptionItem({ option, selected, sx, ...other }) {
  return (
    <Box
      display="flex"
      sx={{
        p: 1,
        gap: 1,
        cursor: 'pointer',
        borderRadius: 1.5,
        border: (theme) =>
          `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.24)}`,
        transition: (theme) =>
          theme.transitions.create(['box-shadow'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.shortest,
          }),
        ...(selected && {
          boxShadow: (theme) => `0 0 0 2px ${theme.vars.palette.primary.main}`,
        }),
        ...sx,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      {...other}
    >
      <Box
        component="span"
        flexGrow={1}
        sx={{ typography: 'subtitle2', textAlign: 'center' }}
      >
        {option?.value}
      </Box>
    </Box>
  );
}
