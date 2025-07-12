import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { SalesList } from '../components/SalesList';
import SalesModal from '../components/SalesModal';
import SalesChart from '../components/SalesChart';

import { useProductsStore, useUserStore } from 'hostApp/store';
import dayjs from 'dayjs';
import { GroupedSale, Sale, StockProduct } from '../../domain/entities';
import { db } from '../../infraestructure/database';
import {
  editSale,
  getStockProducts,
  getUserSales,
  saveSale,
  updateProductQuantity,
} from '../../infraestructure/repositories';

export const Sales = () => {
  const { setStockProducts, getProductById } = useProductsStore();
  const { userInfo } = useUserStore();

  const [groupedSales, setGroupedSales] = useState<Array<GroupedSale>>([]);
  const [openSaleModal, setOpenSaleModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [sales, setSales] = useState<Array<Sale>>([]);
  const [products, setProducts] = useState<Array<StockProduct>>([]);
  const [loading, setLoading] = useState(false);

  const groupSalesByProduct = (sales: Sale[]): GroupedSale[] => {
    const result: GroupedSale[] = [];

    for (const sale of sales) {
      const total = sale.total_price;

      if (sale.product_name) {
        // Só entra no bloco se product_name for uma string válida
        const existing = result.find((item) => item.label === sale.product_name);

        if (existing) {
          existing.value += total;
        } else {
          result.push({
            label: sale.product_name,
            value: total,
          });
        }
      }
    }

    return result;
  };

  const fetchProducts = async () => {
    const resp = await getStockProducts(db);

    setProducts(resp.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as StockProduct));
  };

  const fetchSales = async () => {
    if (!userInfo?.id) return;
    setLoading(true);
    const resp = await getUserSales(db, userInfo.id);
    setSales(resp.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Sale));
    setLoading(false);
  };

  const handleEditSale = (sale: Sale) => {
    const $sale = sale;
    $sale.date = dayjs(sale.date).tz('America/Sao_Paulo').format();
    setSelectedSale($sale);
    setOpenSaleModal(true);
  };

  const handleSaveSale = async (sale: Sale) => {
    const payload = sale;

    if (!payload.sale_id) {
      delete payload.sale_id;
      await saveSale(db, payload);
    } else {
      await editSale(db, payload.sale_id, payload);
      setSelectedSale(null);
    }

    const product = getProductById(sale.product_id);

    await updateProductQuantity(db, sale.product_id, product.quantity - sale.product_quantity);

    fetchSales();
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
    fetchSales();
  }, []);

  useEffect(() => {
    if (products.length) setStockProducts(products);
  }, [products]);

  useEffect(() => {
    if (sales.length) {
      const grouped = groupSalesByProduct(sales);
      setGroupedSales(grouped);
    }
  }, [sales]);

  return (
    <>
      <Grid container spacing={4}>
        <Grid size={8}>
          <SalesList
            loading={loading}
            sales={sales}
            refreshList={fetchSales}
            database={db}
            editSale={handleEditSale}
          />
        </Grid>
        <Grid size={4}>
          <Button
            size="large"
            sx={{ width: '100%', alignItems: 'center', mb: 3 }}
            variant="contained"
            color="primary"
            onClick={() => setOpenSaleModal(true)}
          >
            Adicionar venda
          </Button>
          <SalesChart loading={loading} data={groupedSales} title="Vendas por produto" />
        </Grid>
      </Grid>
      <SalesModal
        open={openSaleModal}
        onClose={() => setOpenSaleModal(false)}
        onSave={handleSaveSale}
        currentSale={selectedSale}
      ></SalesModal>
    </>
  );
};

export default Sales;
