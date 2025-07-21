import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Grid, Tabs, Tab, CircularProgress } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { StockList } from '../components/StockList';
import { StockModal } from '../components/StockModal';
import { ProductionList } from '../components/ProductionList';
import { ProductionModal } from '../components/ProductionModal';

import { db } from '../../infrastructure/database';
import {
  createStockProduct,
  deleteStockProduct,
  getAllStockProducts,
  updateStockProduct,
  createProduction,
  getUserProductions,
  harvestProduction,
} from '../../infrastructure/repositories';
import { useProductsStore, useUserStore } from 'hostApp/store';
import type { Production, StockProduct } from 'hostApp/types';

export const Stock = () => {
  const { userInfo } = useUserStore();
  const { setStockProducts } = useProductsStore();

  const [tab, setTab] = useState(0);

  const [products, setProducts] = useState<StockProduct[]>([]);
  const [loadingStock, setLoadingStock] = useState(true);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<StockProduct | null>(null);

  // Estados da Produção
  const [productions, setProductions] = useState<Production[]>([]);
  const [loadingProductions, setLoadingProductions] = useState(true);
  const [isProductionModalOpen, setIsProductionModalOpen] = useState(false);

  // --- LÓGICA DE DADOS ---
  const fetchProducts = useCallback(async () => {
    setLoadingStock(true);
    try {
      const snapshot = await getAllStockProducts(db);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as StockProduct);
      setProducts(data);
      setStockProducts(data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoadingStock(false);
    }
  }, [setStockProducts]);

  const fetchProductions = useCallback(async () => {
    if (!userInfo?.id) return;
    setLoadingProductions(true);
    try {
      const snapshot = await getUserProductions(db, userInfo.id);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Production);
      setProductions(data);
    } catch (error) {
      console.error('Erro ao buscar produções:', error);
    } finally {
      setLoadingProductions(false);
    }
  }, [userInfo.id]);

  useEffect(() => {
    fetchProducts();
    fetchProductions();
  }, [fetchProducts, fetchProductions]);

  const handleSaveProduct = useCallback(
    async (productData: StockProduct) => {
      try {
        if (productData.id) {
          await updateStockProduct(db, productData.id, productData);
        } else {
          const { id, ...rest } = productData;
          await createStockProduct(db, rest);
        }
        fetchProducts();
      } catch (error) {
        console.error('Erro ao salvar produto:', error);
      } finally {
        setIsStockModalOpen(false);
        setCurrentProduct(null);
      }
    },
    [fetchProducts],
  );

  const handleDeleteProduct = useCallback(
    async (productId: string) => {
      try {
        await deleteStockProduct(db, productId);
        fetchProducts();
      } catch (error) {
        console.error('Erro ao deletar produto:', error);
      }
    },
    [fetchProducts],
  );

  const handleSaveProduction = useCallback(
    async (productionData: Omit<Production, 'id' | 'userId' | 'status'>) => {
      try {
        const newProduction: Omit<Production, 'id'> = {
          ...productionData,
          userId: userInfo.id,
          status: 'in_production',
          creationDate: new Date().toISOString(),
        };
        await createProduction(db, newProduction);
        fetchProductions();
      } catch (error) {
        console.error('Erro ao iniciar produção:', error);
      } finally {
        setIsProductionModalOpen(false);
      }
    },
    [userInfo.id, fetchProductions],
  );

  const handleHarvest = useCallback(
    async (production: Production) => {
      try {
        await harvestProduction(db, production);
        fetchProductions();
        fetchProducts();
      } catch (error) {
        console.error('Erro ao colher produção:', error);
      }
    },
    [fetchProductions, fetchProducts],
  );

  const isLoading = loadingStock || loadingProductions;

  return (
    <Box>
      <Grid container justifyContent="space-between" alignItems="center" mb={3}>
        <Grid item>
          <Typography variant="h4">
            {tab === 0 ? 'Gerenciamento de Estoque' : 'Controle de Produção'}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => (tab === 0 ? setIsStockModalOpen(true) : setIsProductionModalOpen(true))}
          >
            {tab === 0 ? 'Adicionar Produto' : 'Iniciar Produção'}
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
          <Tab label="Estoque" />
          <Tab label="Produção" />
        </Tabs>
      </Box>

      {isLoading && (
        <Box display="flex" justifyContent="center" my={5}>
          <CircularProgress />
        </Box>
      )}

      {tab === 0 && (
        <StockList
          products={products}
          onEdit={(p) => {
            setCurrentProduct(p);
            setIsStockModalOpen(true);
          }}
          onDelete={handleDeleteProduct}
          loading={loadingStock}
        />
      )}

      {tab === 1 && (
        <ProductionList
          productions={productions}
          loading={loadingProductions}
          onHarvest={handleHarvest}
        />
      )}

      <StockModal
        open={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        onSave={handleSaveProduct}
        currentProduct={currentProduct}
      />

      <ProductionModal
        open={isProductionModalOpen}
        onClose={() => setIsProductionModalOpen(false)}
        onSave={handleSaveProduction}
      />
    </Box>
  );
};

export default Stock;
