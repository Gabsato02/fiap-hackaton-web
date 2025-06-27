import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

export const SalesFilter = () => {
  const FILTERS = [
    {
      value: 'name',
      label: 'Nome',
    },
    {
      value: 'product_quantity',
      label: 'Quantidade',
    },
    {
      value: 'date',
      label: 'Data',
    },
    {
      value: 'total_price',
      label: 'Valor',
    },
  ];

  const filterOptions = createFilterOptions({
    matchFrom: 'start',
    stringify: (option: { label: string; value: string }) => option.label,
  });

  return (
    <Autocomplete
      options={FILTERS}
      getOptionLabel={(option) => option.label}
      filterOptions={filterOptions}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Ordenar por" sx={{ mb: 3 }} />}
    />
  );
};
