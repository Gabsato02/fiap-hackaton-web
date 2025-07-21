import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { DateInput } from 'hostApp/global_components';
import { useUserStore, useProductsStore } from 'hostApp/store';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/pt-br';

import type { GoalModalProps, Goal } from '../../domain/entities';
import type { StockProduct } from 'hostApp/types';

dayjs.extend(utc);
dayjs.extend(timezone);

export const GoalModal: React.FC<GoalModalProps> = ({ open, onClose, onSave, currentGoal }) => {
  const { userInfo } = useUserStore();
  const { stockProducts } = useProductsStore();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<'sales' | 'production'>('sales');
  const [productId, setProductId] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [startDate, setStartDate] = useState(dayjs.tz(new Date(), 'America/Sao_Paulo'));
  const [endDate, setEndDate] = useState(dayjs.tz(new Date(), 'America/Sao_Paulo').add(1, 'month'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentGoal) {
      setTitle(currentGoal.title);
      setType(currentGoal.type);
      setTargetValue(currentGoal.targetValue.toString());
      setStartDate(dayjs(currentGoal.startDate));
      setEndDate(dayjs(currentGoal.endDate));
      setProductId(currentGoal.productId || '');
    } else {
      // Reset form
      setTitle('');
      setType('sales');
      setTargetValue('');
      setProductId('');
      setStartDate(dayjs.tz(new Date(), 'America/Sao_Paulo'));
      setEndDate(dayjs.tz(new Date(), 'America/Sao_Paulo').add(1, 'month'));
    }
  }, [currentGoal, open]);

  const handleSave = async () => {
    const isProductionGoalValid = type === 'production' && productId;
    const isSalesGoalValid = type === 'sales';

    if (
      title &&
      Number(targetValue) > 0 &&
      startDate &&
      endDate &&
      (isProductionGoalValid || isSalesGoalValid)
    ) {
      setLoading(true);

      const selectedProduct = stockProducts.find((p) => p.id === productId);

      const goalData: Goal = {
        id: currentGoal?.id || '',
        title,
        type,
        targetValue: Number(targetValue),
        startDate: startDate.startOf('day').toISOString(),
        endDate: endDate.endOf('day').toISOString(),
        userId: userInfo?.id || '',
        productId: type === 'production' ? productId : undefined,
        productName: type === 'production' ? selectedProduct?.name : undefined,
      };

      await onSave(goalData);
      setLoading(false);
      onClose();
    }
  };

  const isFormValid =
    title &&
    Number(targetValue) > 0 &&
    startDate &&
    endDate &&
    (type === 'sales' || (type === 'production' && productId));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{currentGoal ? 'Editar Meta' : 'Definir Nova Meta'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 2 }}>
          <Grid item xs={12}>
            <TextField
              label="Título da Meta"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Meta</InputLabel>
              <Select
                value={type}
                label="Tipo de Meta"
                onChange={(e) => setType(e.target.value as typeof type)}
              >
                <MenuItem value="sales">Vendas (R$)</MenuItem>
                <MenuItem value="production">Produção (Unidades)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {type === 'production' && (
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
          )}

          <Grid item xs={12}>
            <TextField
              label={type === 'sales' ? 'Valor da Meta (R$)' : 'Quantidade da Meta (Unidades)'}
              type="number"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <DateInput
              label="Data de Início"
              value={startDate}
              onChange={(date) => setStartDate(date || dayjs())}
            />
          </Grid>

          <Grid item xs={6}>
            <DateInput
              label="Data de Fim"
              value={endDate}
              onChange={(date) => setEndDate(date || dayjs())}
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
