import { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';

import {
  Box,
  Paper,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  TableContainer,
  InputAdornment,
} from '@mui/material';

import { fCurrency } from 'src/utils/format-number';
import { generateCombinations } from 'src/utils/helper';

export function DataGridProductVariants({ data, control }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(generateCombinations(data));
  }, [data]);

  return (
    <TableContainer component={Paper} sx={{ p: 1, overflowX: 'auto' }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {data.map((variant) => (
              <TableCell
                style={{ borderColor: '#ddd' }}
                sx={{
                  minWidth: 100,
                  textAlign: 'center',
                  border: '1px solid #ddd',
                }}
                key={variant.id}
              >
                {variant.variantName}
              </TableCell>
            ))}
            <TableCell
              style={{ borderColor: '#ddd' }}
              sx={{
                minWidth: 150,
                textAlign: 'center',
                border: '1px solid #ddd',
              }}
            >
              Giá bán
            </TableCell>
            <TableCell
              colSpan={3}
              style={{ borderColor: '#ddd' }}
              sx={{
                minWidth: 450,
                textAlign: 'center',
                border: '1px solid #ddd',
              }}
            >
              Kích thước
            </TableCell>
            <TableCell
              style={{ borderColor: '#ddd' }}
              sx={{
                minWidth: 150,
                textAlign: 'center',
                border: '1px solid #ddd',
              }}
            >
              Cân nặng
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={row.join('-')}>
              {row.map((cell, cellIndex) => {
                if (rowIndex !== 0 && cell === rows[rowIndex - 1][cellIndex]) {
                  return null;
                }

                let rowSpan = 1;
                for (let i = rowIndex + 1; i < rows.length; i += 1) {
                  if (cell === rows[i][cellIndex]) {
                    rowSpan += 1;
                  } else {
                    break;
                  }
                }

                return (
                  <TableCell
                    style={{ borderColor: '#ddd' }}
                    sx={{ border: '1px solid #ddd' }}
                    rowSpan={rowSpan}
                    key={`${cell}-${cellIndex}`}
                  >
                    {cell}
                  </TableCell>
                );
              })}
              <TableCell
                key={`unitPrice-${row.id}`}
                sx={{ border: '1px solid #ddd' }}
                style={{ borderColor: '#ddd' }}
              >
                <Controller
                  name={`productVariants[${rowIndex}].unitPrice`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      fullWidth
                      type="text"
                      label="Giá bán"
                      InputLabelProps={{ shrink: true }}
                      value={fCurrency(value, { currencyDisplay: 'code' })}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/\D/g, '');
                        onChange(Number(rawValue));
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            <Box
                              component="span"
                              sx={{ color: 'text.disabled' }}
                            >
                              ₫
                            </Box>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </TableCell>
              <TableCell
                key={`length-${row.id}`}
                sx={{ border: '1px solid #ddd' }}
                style={{ borderColor: '#ddd' }}
              >
                <Controller
                  name={`productVariants[${rowIndex}].dimension.length`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      fullWidth
                      type="text"
                      label="Chiều dài"
                      InputLabelProps={{ shrink: true }}
                      value={fCurrency(value, { currencyDisplay: 'code' })}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/\D/g, '');
                        onChange(Number(rawValue));
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            <Box
                              component="span"
                              sx={{ color: 'text.disabled' }}
                            >
                              cm
                            </Box>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </TableCell>
              <TableCell
                key={`height-${row.id}`}
                sx={{ border: '1px solid #ddd' }}
                style={{ borderColor: '#ddd' }}
              >
                <Controller
                  name={`productVariants[${rowIndex}].dimension.height`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      fullWidth
                      type="text"
                      label="Chiều cao"
                      InputLabelProps={{ shrink: true }}
                      value={fCurrency(value, { currencyDisplay: 'code' })}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/\D/g, '');
                        onChange(Number(rawValue));
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            <Box
                              component="span"
                              sx={{ color: 'text.disabled' }}
                            >
                              cm
                            </Box>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </TableCell>
              <TableCell
                key={`width-${row.id}`}
                sx={{ border: '1px solid #ddd' }}
                style={{ borderColor: '#ddd' }}
              >
                <Controller
                  name={`productVariants[${rowIndex}].dimension.width`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      fullWidth
                      type="text"
                      label="Chiều rộng"
                      InputLabelProps={{ shrink: true }}
                      value={fCurrency(value, { currencyDisplay: 'code' })}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/\D/g, '');
                        onChange(Number(rawValue));
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            <Box
                              component="span"
                              sx={{ color: 'text.disabled' }}
                            >
                              cm
                            </Box>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </TableCell>
              <TableCell
                key={`weight-${row.id}`}
                sx={{ border: '1px solid #ddd' }}
                style={{ borderColor: '#ddd' }}
              >
                <Controller
                  name={`productVariants[${rowIndex}].weight`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      fullWidth
                      type="text"
                      label="Cân nặng"
                      InputLabelProps={{ shrink: true }}
                      value={fCurrency(value, { currencyDisplay: 'code' })}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/\D/g, '');
                        onChange(Number(rawValue));
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            <Box
                              component="span"
                              sx={{ color: 'text.disabled' }}
                            >
                              kg
                            </Box>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}