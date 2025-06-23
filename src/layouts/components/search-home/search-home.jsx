import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';
import { SearchNotFound } from 'src/components/search-not-found';
import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from 'src/hooks/use-debounce';
import { useDispatch, useSelector } from 'react-redux';
import { selectSearch, setMode } from 'src/state/search/search.slice';
import { searchProductsAsync } from 'src/services/product/product.service';
import { IconButton, Switch, Tooltip } from '@mui/material';

// ----------------------------------------------------------------------

export function SearchHome() {
  const dispatch = useDispatch();

  const { results, loading, mode } = useSelector(selectSearch);

  const router = useRouter();

  const handleClick = (id) => {
    router.push(paths.product.details(id));
  };

  const [searchValue, setSearchValue] = useState('');

  const debouncedSearchValue = useDebounce(searchValue, 800);

  const handleChangeValue = useCallback((newValue) => {
    setSearchValue(newValue || '');
  }, []);

  useEffect(() => {
    if (debouncedSearchValue) {
      if (mode !== 'ai') {
        dispatch(
          searchProductsAsync({
            pageNumber: 1,
            pageSize: 10,
            searchQuery: debouncedSearchValue,
          }),
        );
      }
    }
  }, [dispatch, debouncedSearchValue, mode]);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.target.blur();
      router.push(`${paths.product.root}?search=${searchValue.trim()}`);
    }
  };
  return (
    <Autocomplete
      sx={{ width: { xs: 150, sm: 300, md: 400, lg: 500 } }}
      loading={loading}
      popupIcon={null}
      options={results}
      inputValue={searchValue}
      onInputChange={(event, newValue) => handleChangeValue(newValue)}
      getOptionLabel={(option) => option.name}
      noOptionsText={<SearchNotFound query={debouncedSearchValue} />}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      autoSelect={false}
      autoHighlight={false}
      selectOnFocus={false}
      clearOnBlur={false}
      handleHomeEndKeys={false}
      slotProps={{
        popper: { placement: 'bottom-start', sx: { minWidth: 320 } },
        paper: { sx: { [` .${autocompleteClasses.option}`]: { pl: 0.75 } } },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Tìm kiếm..."
          onKeyDown={handleKeyPress}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Iconify
                  icon="eva:search-fill"
                  sx={{ ml: 1, color: 'text.disabled' }}
                />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {loading ? <Iconify icon="svg-spinners:8-dots-rotate" /> : null}
                {params.InputProps.endAdornment}
                <Tooltip title="AI Search">
                  <Switch
                    name="AI Search"
                    checked={mode === 'ai'}
                    onChange={() => {
                      dispatch(setMode(mode === 'ai' ? 'normal' : 'ai'));
                    }}
                  />
                </Tooltip>
                <Tooltip title="Tìm kiếm sản phẩm bằng hình ảnh">
                  <IconButton
                    name="Image Search"
                    sx={{
                      width: 40,
                      height: 40,
                      ':hover': { color: 'primary.main' },
                      mr: -3,
                    }}
                    onClick={() => {
                      router.push(paths.product.imageSearch);
                    }}
                  >
                    <Iconify icon="solar:camera-square-bold" />
                  </IconButton>
                </Tooltip>
              </>
            ),
          }}
        />
      )}
      renderOption={(props, product, { inputValue }) => (
        <Box
          component="li"
          {...props}
          onClick={() => handleClick(product.id)}
          key={product.id}
        >
          <Avatar
            key={product.id}
            alt={product.name}
            src={product.thumbnailImageUrl}
            variant="rounded"
            sx={{
              mr: 1.5,
              width: 48,
              height: 48,
              flexShrink: 0,
              borderRadius: 1,
            }}
          />

          <Typography
            key={`name-${product.id}`}
            component="span"
            color="textPrimary"
            sx={{
              typography: 'body2',
              fontWeight: 'fontWeightMedium',
            }}
          >
            {product.name}
          </Typography>
        </Box>
      )}
    />
  );
}
