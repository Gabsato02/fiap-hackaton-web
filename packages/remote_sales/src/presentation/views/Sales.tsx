import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { SalesList } from '../components/SalesList';
import SalesModal from '../components/SalesModal';
import SalesChart from '../components/SalesChart';
import { FIREBASE_CONFIG } from 'hostApp/vars';
import { Sale, Product } from 'hostApp/domain/entities';
import { initializeApp } from 'firebase/app';
import { addDoc, collection, doc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore';
import { useProductsStore, useUserStore } from 'hostApp/store';
import dayjs from 'dayjs';
import { GroupedSale } from '../../domain/entities';

const app = initializeApp(FIREBASE_CONFIG);

const db = getFirestore(app);

export const Sales = () => {
  const { setStockProducts, getProductById } =  useProductsStore();
  const { userInfo } = useUserStore();

  const [groupedSales, setGroupedSales] = useState<Array<GroupedSale>>([]);
  const [openSaleModal, setOpenSaleModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [sales, setSales] = useState<Array<Sale>>([]);
  const [products, setProducts] = useState<Array<Product>>([]);
  const [loading, setLoading] = useState(false);

  const groupSalesByProduct = (sales: Sale[]): GroupedSale[] => {
    const result: GroupedSale[] = [];
  
    for (const sale of sales) {
      const total = sale.total_price;
      const existing = result.find(item => item.label === sale.product_name);
  
      if (existing) {
        existing.value += total;
      } else {
        result.push({
          label: sale.product_name,
          value: total,
        });
      }
    }
  
    return result;
  }

  const fetchProducts = async () => {
    const q = query(collection(db, "stock_products"), where("quantity", ">", 0));
    const resp = await getDocs(q);
    setProducts(resp.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const fetchSales = async () => {
    if (!userInfo?.id) return;
    setLoading(true);
    const q = query(collection(db, "sales"), where("seller_id", "==", userInfo.id));
    const resp = await getDocs(q);
    setSales(resp.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  const handleEditSale = (sale: Sale) => {
    const $sale = sale;
    $sale.date = dayjs(sale.date).tz('America/Sao_Paulo');
    setSelectedSale($sale);
    setOpenSaleModal(true);
  }

  const handleSaveSale = async (sale: Sale) => {
    const payload = sale;

    if (!payload.sale_id) {
      delete payload.sale_id;
      await addDoc(collection(db, "sales"), sale);
    } else {
      await setDoc(doc(db, "sales", sale.sale_id), payload, { merge: true });
      setSelectedSale(null);
    }

    const product = getProductById(sale.product_id);

    await setDoc(doc(db, "stock_products", sale.product_id), {
      quantity: product.quantity - sale.product_quantity,
    }, { merge: true });
  
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
