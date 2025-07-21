import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { useProductsStore } from 'hostApp/store';
import type { ProductionModalProps } from '../../domain/entities';
import type { StockProduct } from 'hostApp/types';

export const ProductionModal: React.FC<ProductionModalProps> = ({ open, onClose, onSave }) => {
  const { stockProducts } = useProductsStore();
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!productId || !quantity || Number(quantity) <= 0) {
      setError('Por favor, preencha todos os campos corretamente.');
      return;
    }
    setLoading(true);
    setError('');

    const selectedProduct = stockProducts.find((p) => p.id === productId);
    if (selectedProduct) {
      await onSave({
        productId,
        productName: selectedProduct.name,
        quantity: Number(quantity),
      });
    }

    setLoading(false);
    handleClose();
  };

  const handleClose = () => {
    setProductId('');
    setQuantity('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Iniciar Nova Produção</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 2 }}>
          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Produto</InputLabel>
              <Select
                value={productId}
                label="Produto"
                onChange={(e) => setProductId(e.target.value)}
              >
                {stockProducts.map((product: StockProduct) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Quantidade a ser Produzida"
              type="number"
              InputProps={{ inputProps: { min: 1 } }}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained" disabled={loading}>
          {loading ? 'Salvando...' : 'Iniciar Produção'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
