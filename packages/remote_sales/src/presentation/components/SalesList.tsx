import React from 'react';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { SalesCard } from './SalesCard';
import { SalesFilter } from './SalesFilter';

export const SalesList: React.FC<{ loading: boolean }> = ({ loading }) => {
  return (
    <List
      sx={{ width: '100%' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <Typography sx={{ mb: 3 }} variant="h4">
          Histórico de Vendas
        </Typography>
      }
    >
      <SalesFilter />

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <SalesCard />
      )}
    </List>
  );
};
