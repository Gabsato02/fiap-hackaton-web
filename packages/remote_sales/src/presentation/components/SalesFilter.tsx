import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { FilterOption } from '../../domain/entities';

export const SalesFilter = ({ onFilterChange }: {
  onFilterChange: (filterValue: string) => void;
}) => {
  const FILTERS: FilterOption[] = [
    { value: 'product_name', label: 'Nome' },
    { value: 'product_quantity', label: 'Quantidade' },
    { value: 'date', label: 'Data' },
    { value: 'total_price', label: 'Valor' },
  ];

  const filterOptions = createFilterOptions({
    matchFrom: 'start',
    stringify: (option: FilterOption) => option.label,
  });

  return (
    <Autocomplete
      options={FILTERS}
      getOptionLabel={(option) => option.label}
      filterOptions={filterOptions}
      sx={{ width: 300 }}
      onChange={(_, newValue) => {
        if (newValue) {
          onFilterChange(newValue.value);
        }
      }}
      renderInput={(params) => (
        <TextField {...params} label="Ordenar por" />
      )}
    />
  );
};
