import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { StockList } from '../components/StockList';
import { StockModal } from '../components/StockModal';

import { db } from '../../infrastructure/database';
import {
  createStockProduct,
  deleteStockProduct,
  getAllStockProducts,
  updateStockProduct,
} from '../../infrastructure/repositories';
import { useProductsStore } from 'hostApp/store';

import type { StockProduct } from '../../domain/entities';

export const Stock = () => {
  const { setStockProducts } = useProductsStore();
  const [products, setProducts] = useState<StockProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<StockProduct | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const snapshot = await getAllStockProducts(db);
      const productsData = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as StockProduct,
      );
      setProducts(productsData);
      setStockProducts(productsData);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  }, [setStockProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOpenModal = (product: StockProduct | null = null) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
  };

  const handleSaveProduct = async (productData: StockProduct) => {
    try {
      if (productData.id) {
        // Edição
        await updateStockProduct(db, productData.id, productData);
      } else {
        // Criação
        const { id, ...rest } = productData;
        await createStockProduct(db, rest);
      }
      fetchProducts();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    } finally {
      handleCloseModal();
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteStockProduct(db, productId);
      fetchProducts();
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
    }
  };

  return (
    <Box>
      <Grid container justifyContent="space-between" alignItems="center" mb={3}>
        <Grid>
          <Typography variant="h4">Gerenciamento de Estoque</Typography>
        </Grid>

        <Grid>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => handleOpenModal()}
          >
            Adicionar Produto
          </Button>
        </Grid>
      </Grid>

      <StockList
        products={products}
        onEdit={handleOpenModal}
        onDelete={handleDeleteProduct}
        loading={loading}
      />

      <StockModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
        currentProduct={currentProduct}
      />
    </Box>
  );
};

export default Stock;
