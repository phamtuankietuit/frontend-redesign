import { useTheme, alpha as hexAlpha } from '@mui/material/styles';

import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export function ChartColumnSingle({ chart }) {
  const theme = useTheme();

  const chartColors = chart.colors ?? [hexAlpha(theme.palette.primary.dark, 0.8)];

  const chartOptions = useChart({
    colors: chartColors,
    stroke: { width: 0 },
    xaxis: { categories: chart.categories },
    tooltip: {
      y: {
        formatter: (value) => `${value} thousands`,
        title: { formatter: () => '' },
      },
    },
    plotOptions: { bar: { columnWidth: '40%' } },
  });

  return <Chart type="bar" series={chart.series} options={chartOptions} height={320} />;
}