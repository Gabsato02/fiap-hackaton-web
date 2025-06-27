import React, { useEffect, useMemo, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { SaleModalProps } from '../../domain/entities';

export default function SalesModal({
  open,
  onClose,
  onSave,
  products,
  currentSale,
}: SaleModalProps) {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState('');

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === productId),
    [productId, products],
  );

  const unitPrice = useMemo(() => (selectedProduct?.price || 0).toFixed(2), [selectedProduct]);

  const totalPrice = useMemo(() => (unitPrice * quantity).toFixed(2), [unitPrice, quantity]);

  useEffect(() => {
    if (currentSale) {
      setProductId(currentSale.productId);
      setQuantity(currentSale.quantity);
      setDate(currentSale.date);
    } else {
      setProductId('');
      setQuantity(1);
      setDate('');
    }
  }, [currentSale, open]);

  const handleSave = () => {};

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {currentSale ? `Editar Venda - #${currentSale.id}` : 'Adicionar Venda'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid size={12} sx={{ pt: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="product-select-label">Produto</InputLabel>
              <Select
                labelId="product-select-label"
                fullWidth
                label="Produto"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              >
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={12}>
            <TextField
              type="number"
              fullWidth
              label="Quantidade"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              label="Data da venda"
              fullWidth
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Grid>

          <Grid size={6}>
            <TextField label="Valor unitário (R$)" fullWidth value={unitPrice} disabled />
          </Grid>

          <Grid size={6}>
            <TextField label="Valor total (R$)" fullWidth value={totalPrice} disabled />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained" color="success">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
