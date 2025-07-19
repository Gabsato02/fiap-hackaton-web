import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
} from '@mui/material';

import type { StockModalProps, StockProduct } from '../../domain/entities';

export const StockModal: React.FC<StockModalProps> = ({
  open,
  onClose,
  onSave,
  currentProduct,
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentProduct) {
      setName(currentProduct.name);
      setPrice(currentProduct.price);
      setQuantity(currentProduct.quantity || '');
    } else {
      setName('');
      setPrice('');
      setQuantity('');
    }
  }, [currentProduct, open]);

  const handleSave = async () => {
    if (name && Number(price) > 0 && Number(quantity) >= 0) {
      setLoading(true);
      const productData: StockProduct = {
        id: currentProduct?.id || '',
        name,
        price: Number(price),
        quantity: Number(quantity),
        updated_at: new Date().toISOString(),
      };
      await onSave(productData);
      setLoading(false);
    }
  };

  const isFormValid = name && Number(price) > 0 && Number(quantity) >= 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{currentProduct ? 'Editar Produto' : 'Adicionar Produto'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 2 }}>
          <Grid>
            <TextField
              label="Nome do Produto"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid>
            <TextField
              label="Preço (R$)"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              fullWidth
            />
          </Grid>

          <Grid>
            <TextField
              label="Quantidade"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          variant="contained"
          disabled={!isFormValid || loading}
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
