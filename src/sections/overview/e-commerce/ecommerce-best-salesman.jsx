import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import CardHeader from '@mui/material/CardHeader';
import { Link, Stack, Rating, Typography } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { selectHome } from 'src/state/home/home.slice';
import { fCurrency, fMyShortenNumber } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Image } from 'src/components/image';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';

// ----------------------------------------------------------------------

export function EcommerceBestSalesman({
  title,
  subheader,
  tableData,
  headLabel,
  ...other
}) {
  const { topSellingMonthly, topSellingMonthlyLoading } =
    useSelector(selectHome);

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        sx={{ pb: 3, backgroundColor: '#2c3248', color: 'white' }}
      />

      <Scrollbar sx={{ minHeight: 422 }}>
        <Table sx={{ minWidth: 640 }}>
          <TableHeadCustom headLabel={headLabel} />

          <TableBody>
            {topSellingMonthly.map((row, index) => (
              <RowItem key={row.id} row={row} index={index} />
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------

function RowItem({ row, index }) {
  return (
    <TableRow>
      <TableCell>
        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
          <Image
            alt={row?.thumbnailImageUrl}
            src={row?.thumbnailImageUrl}
            sx={{
              borderRadius: 1.5,
              maxWidth: 100,
            }}
          />
          <Stack spacing={1} sx={{ p: 3, pt: 2 }}>
            <Link component={RouterLink} color="inherit" variant="h6" noWrap>
              {row?.name}
            </Link>

            <Stack
              direction="column"
              justifyContent="space-between"
              spacing={1}
            >
              <Stack
                direction="row"
                alignItems="center"
                sx={{ color: 'text.disabled', typography: 'body2' }}
              >
                <Rating
                  size="small"
                  value={row?.averageRating}
                  precision={0.1}
                  readOnly
                  sx={{ mr: 1 }}
                />
                {/* {`(${fMyShortenNumber(row.totalRatings)})`} */}
              </Stack>

              <Stack
                direction="row"
                spacing={2}
                sx={{ typography: 'subtitle1' }}
              >
                <Box
                  component="span"
                  sx={{
                    color: 'text.disabled',
                    textDecoration: 'line-through',
                  }}
                >
                  {fCurrency(row?.minUnitPrice)}
                </Box>
                <Box component="span">
                  {fCurrency(row?.minRecommendedRetailPrice)}
                </Box>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </TableCell>

      <TableCell align="center">
        <Typography variant="h6">
          {fCurrency(row?.soldCount, { currencyDisplay: 'code' })}
        </Typography>
      </TableCell>

      <TableCell align="center">
        <Label
          variant="soft"
          color={
            (index === 0 && 'primary') ||
            (index === 1 && 'secondary') ||
            (index === 2 && 'info') ||
            (index === 3 && 'warning') ||
            'error'
          }
          sx={{
            fontSize: '18px',
            p: 3,
          }}
        >
          {index + 1}
        </Label>
      </TableCell>
    </TableRow>
  );
}
