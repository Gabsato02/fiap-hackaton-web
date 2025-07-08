import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { SalesList } from '../components/SalesList';
import SalesModal from '../components/SalesModal';
import SalesChart from '../components/SalesChart';
import { FIREBASE_CONFIG } from 'hostApp/vars';
import { Sale, Product } from 'hostApp/domain/entities';
import { initializeApp } from 'firebase/app';
import { addDoc, collection, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
import { useProductsStore } from 'hostApp/store';

const app = initializeApp(FIREBASE_CONFIG);

const db = getFirestore(app);

export const Sales = () => {
  const sampleData = [
    { label: 'Vendas', value: 40, color: '#4caf50' },
    { label: 'Marketing', value: 35, color: '#2196f3' },
    { label: 'TI', value: 25 },
  ];

  const { setStockProducts, getProductById } =  useProductsStore();

  const [openSaleModal, setOpenSaleModal] = useState(false);
  const [sales, setSales] = useState<Array<Sale>>([]);
  const [products, setProducts] = useState<Array<Product>>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    const resp = await getDocs(collection(db, "stock_products"));
    setProducts(resp.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const fetchSales = async () => {
    setLoading(true);
    const resp = await getDocs(collection(db, "sales"));
    setSales(resp.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  const handleSaveSale = async (sale: Sale) => {
    await addDoc(collection(db, "sales"), sale);

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
  
  return (
    <>
      <Grid container spacing={4}>
        <Grid size={8}>
          <SalesList loading={loading} sales={sales} refreshList={fetchSales} database={db}  />
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
          <SalesChart loading={loading} data={sampleData} title="Vendas por produto" />
        </Grid>
      </Grid>
      <SalesModal
        open={openSaleModal}
        onClose={() => setOpenSaleModal(false)}
        onSave={handleSaveSale}
        products={products}
      ></SalesModal>
    </>
  );
};

export default Sales;
