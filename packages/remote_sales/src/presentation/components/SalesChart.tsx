import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useTheme } from '@mui/material/styles';
import { Box, Card, CircularProgress, Typography } from '@mui/material';
import { SalesChartProps } from '../../domain/entities';

const SalesChart: React.FC<SalesChartProps> = ({ data, title, width = 400, height = 400, loading }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);
  const theme = useTheme();

  const defaultColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const backgroundColor = data.map((d, i) => d.color || defaultColors[i % defaultColors.length]);

    chartRef.current = new Chart(canvasRef.current, {
      type: 'pie',
      data: {
        labels: data.map((d) => d.label),
        datasets: [
          {
            data: data.map((d) => d.value),
            backgroundColor,
            borderWidth: 1,
            borderColor: theme.palette.background.paper,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: undefined,
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [data, title, theme]);

  return (
    <Card sx={{ py: 3 }}>
      <Typography align="center" component="span" variant="h5" sx={{ display: 'block', mb: 3 }}>
        {title}
      </Typography>
      { loading ? (<Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>) : <canvas ref={canvasRef} width={width} height={height} />
      }
      
    </Card>
  );
};

export default SalesChart;
