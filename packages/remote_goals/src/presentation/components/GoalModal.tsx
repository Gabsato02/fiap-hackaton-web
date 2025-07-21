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
import { useUserStore } from 'hostApp/store';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/pt-br';

import type { GoalModalProps, Goal } from '../../domain/entities';

dayjs.extend(utc);
dayjs.extend(timezone);

export const GoalModal: React.FC<GoalModalProps> = ({
  open,
  onClose,
  onSave,
  currentGoal,
}) => {
  const { userInfo } = useUserStore(); // 👈 Usando useUserStore
  
  const [title, setTitle] = useState('');
  const [type, setType] = useState('sales');
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
    } else {
      setTitle('');
      setType('sales');
      setTargetValue('');
      setStartDate(dayjs.tz(new Date(), 'America/Sao_Paulo'));
      setEndDate(dayjs.tz(new Date(), 'America/Sao_Paulo').add(1, 'month'));
    }
  }, [currentGoal, open]);

  const handleSave = async () => {
    if (title && Number(targetValue) > 0 && startDate && endDate) {
      setLoading(true);
      
      const goalData: Goal = {
        id: currentGoal?.id || '',
        title,
        type: type as 'production' | 'sales',
        targetValue: Number(targetValue),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        userId: userInfo?.id || '', // 👈 Usando o userId do usuário logado
      };
      
      console.log('Meta salva:', goalData);
      console.log('🆔 UserId sendo usado no modal:', userInfo?.id);
      console.log('� UserInfo completo no modal:', userInfo);
      
      await onSave(goalData);
      setLoading(false);
    }
  };

  const isFormValid = title && Number(targetValue) > 0 && startDate && endDate;

  const getValueLabel = () => {
    return type === 'sales' ? 'Valor da Meta (R$)' : 'Quantidade Meta (unidades)';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{currentGoal ? 'Editar Meta' : 'Definir Nova Meta'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 2 }}>
          <Grid size={12}>
            <TextField
              label="Título da Meta"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid size={6}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Meta</InputLabel>
              <Select
                value={type}
                label="Tipo de Meta"
                onChange={(e) => setType(e.target.value)}
              >
                <MenuItem value="sales">Vendas</MenuItem>
                <MenuItem value="production">Produção</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={6}>
            <TextField
              label={getValueLabel()}
              type="number"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid size={6}>
            <DateInput
              label="Data de Início"
              value={startDate}
              onChange={(date: dayjs.Dayjs | null) => setStartDate(date || dayjs())}
            />
          </Grid>

          <Grid size={6}>
            <DateInput
              label="Data de Fim"
              value={endDate}
              onChange={(date: dayjs.Dayjs | null) => setEndDate(date || dayjs())}
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