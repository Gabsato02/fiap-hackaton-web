import React from 'react';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import { SalesCard } from './SalesCard';
import { SalesFilter } from './SalesFilter';

export const SalesList = () => {
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
      <SalesCard />
    </List>
  );
};
