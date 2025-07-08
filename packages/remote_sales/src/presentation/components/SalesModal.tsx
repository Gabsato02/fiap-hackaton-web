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
import { DateInput } from 'hostApp/global_components';
import { useProductsStore, useUserStore } from 'hostApp/store';
import { Product } from 'hostApp/domain/entities';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/pt-br';

dayjs.extend(utc);
dayjs.extend(timezone);

export default function SalesModal({
  open,
  onClose,
  onSave,
  currentSale,
}: SaleModalProps) {
  const { stockProducts } =  useProductsStore();
  const { userInfo } = useUserStore();
  
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(dayjs.tz(new Date(), 'America/Sao_Paulo'));

  const selectedProduct = useMemo(
    () => stockProducts.find((p: Product) => p.id === productId),
    [productId, stockProducts],
  );

  const unitPrice = useMemo(() => {
    if (currentSale?.product_id === productId) return currentSale?.product_price?.toFixed(2);
    return (selectedProduct?.price || 0).toFixed(2)
  }, [selectedProduct]);

  const totalPrice = useMemo(() => (unitPrice * quantity).toFixed(2), [unitPrice, quantity]);

  useEffect(() => {
    if (currentSale) {
      setProductId(currentSale.product_id);
      setQuantity(currentSale.product_quantity);
      setDate(currentSale.date);
    } else {
      setProductId('');
      setQuantity(1);
      setDate(dayjs.tz(new Date(), 'America/Sao_Paulo'));
    }
  }, [currentSale, open]);

  const handleSave = async () => {
    setLoading(true);
 
    try {
      const payload = {
        product_id: productId,
        product_name: selectedProduct?.name || '',
        product_quantity: quantity,
        product_price: parseFloat(unitPrice),
        date: date.toISOString(),
        total_price: parseFloat(totalPrice),
        seller_id: userInfo.id,
        sale_id: currentSale ? currentSale.id : undefined,
      };

      await onSave(payload)
    } catch {} finally {
      setLoading(false);
      onClose();
    }
  };

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
                {stockProducts.map((product: Product) => (
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
              InputProps={{ inputProps: { min: 1, max: selectedProduct?.quantity || 10 } }}
              label="Quantidade"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </Grid>

          <Grid size={12}>
            <DateInput label="Data da venda" value={date} onChange={(v: dayjs.Dayjs) => setDate(v)} />
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
        <Button onClick={handleSave} variant="contained" color="success" disabled={!productId} loading={loading}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
