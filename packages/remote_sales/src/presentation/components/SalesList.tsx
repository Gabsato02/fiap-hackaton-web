import React, { useMemo, useState } from 'react';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

import { SalesCard } from './SalesCard';
import { SalesFilter } from './SalesFilter';
import { SalesListProps } from '../../domain/entities';
import { deleteDoc, doc } from 'firebase/firestore';

export const SalesList: React.FC<SalesListProps> = ({ 
  loading, 
  sales, 
  refreshList, 
  editSale,
  database 
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('date');
  const [sortAscending, setSortAscending] = useState<boolean>(false);

  const toggleSortOrder = () => {
    setSortAscending((prev) => !prev);
  };

  const handleDeleteSale = async (id: string) => {
    await deleteDoc(doc(database, "sales", id));
    refreshList();
  };

  const sortedSales = useMemo(() => {
    if (!sales) return [];

    const sorted = [...sales].sort((a, b) => {
      const aVal = a[selectedFilter];
      const bVal = b[selectedFilter];

      let comparison = 0;

      if (selectedFilter === 'date') {
        comparison = new Date(aVal).getTime() - new Date(bVal).getTime();
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }

      return sortAscending ? comparison : -comparison;
    });

    return sorted;
  }, [sales, selectedFilter, sortAscending]);

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
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <SalesFilter onFilterChange={(value) => setSelectedFilter(value)} />
        <IconButton onClick={toggleSortOrder} aria-label="Alternar ordem">
          {sortAscending ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
        </IconButton>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : sortedSales.length === 0 ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <Typography variant="body1" color="text.secondary">
            Nenhuma venda encontrada.
          </Typography>
        </Box>
      ) : (
        sortedSales.map((sale) => (
          <SalesCard 
            key={sale.id} 
            sale={sale} 
            onDelete={() => handleDeleteSale(sale.id)} 
            onEdit={(sale) => editSale(sale)}
          />
        ))
      )}
    </List>
  );
};
