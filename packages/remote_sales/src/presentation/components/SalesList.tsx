import React from 'react';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { SalesCard } from './SalesCard';
import { SalesFilter } from './SalesFilter';
import { SalesListProps } from '../../domain/entities';
import { deleteDoc, doc } from 'firebase/firestore';

export const SalesList: React.FC<SalesListProps> = ({ loading, sales, refreshList, database }) => {

  const handleDeleteSale = async (id: string) => {
    await deleteDoc(doc(database, "sales", id));
    refreshList();
  };

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
      ) : sales?.length === 0 ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <Typography variant="body1" color="text.secondary">
            Nenhuma venda encontrada.
          </Typography>
        </Box>
      ) : (
        sales.map((sale) => (
          <SalesCard key={sale.id} sale={sale} onDelete={() => handleDeleteSale(sale.id)} />
        ))
      )}
    </List>
  );
};
