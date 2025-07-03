import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { SalesList } from '../components/SalesList';
import SalesModal from '../components/SalesModal';
import SalesChart from '../components/SalesChart';

export const Sales = () => {
  const sampleData = [
    { label: 'Vendas', value: 40, color: '#4caf50' },
    { label: 'Marketing', value: 35, color: '#2196f3' },
    { label: 'TI', value: 25 },
  ];

  const [openSaleModal, setOpenSaleModal] = useState(false);
  const [loading] = useState(false);

  return (
    <>
      <Grid container spacing={4}>
        <Grid item size={8}>
          <SalesList loading={loading} />
        </Grid>
        <Grid item size={4}>
          <Button
            size="large"
            sx={{ width: '100%', alignItems: 'center', mb: 3 }}
            variant="contained"
            color="primary"
            onClick={() => setOpenSaleModal(true)}
          >
            Adicionar venda
          </Button>
          <SalesChart loading={loading} data={sampleData} title="Vendas por produto" />
        </Grid>
      </Grid>
      <SalesModal
        open={openSaleModal}
        onClose={() => setOpenSaleModal(false)}
        onSave={() => setOpenSaleModal(false)}
        products={[
          { id: 1, name: 'Product 1', price: 100 },
          { id: 2, name: 'Product 2', price: 200 },
        ]}
      ></SalesModal>
    </>
  );
};

export default Sales;
