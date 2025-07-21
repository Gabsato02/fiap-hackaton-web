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
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/pt-br';

import type { GoalModalProps } from '../../domain/entities';

dayjs.extend(utc);
dayjs.extend(timezone);

// 🔥 PRODUTOS MOCKADOS - FODA-SE O STORE
const MOCK_PRODUCTS = [
  { id: '1', name: 'Notebook Dell' },
  { id: '2', name: 'Mouse Logitech' },
  { id: '3', name: 'Teclado Mecânico' },
  { id: '4', name: 'Monitor 24"' },
  { id: '5', name: 'Cadeira Gamer' },
  { id: '6', name: 'Headset Wireless' },
];

export const GoalModal: React.FC<GoalModalProps> = ({
  open,
  onClose,
  onSave,
  currentGoal,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('venda');
  const [value, setValue] = useState('');
  const [productId, setProductId] = useState('');
  const [deadline, setDeadline] = useState(dayjs.tz(new Date(), 'America/Sao_Paulo'));
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    console.log('Meta salva:', {
      title,
      description,
      type,
      value,
      productId,
      deadline: deadline.toISOString()
    });
    
    onClose();
  };

  const getValueLabel = () => {
    return type === 'venda' ? 'Valor da Meta (R$)' : 'Quantidade Meta (unidades)';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Definir Nova Meta</DialogTitle>
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

          <Grid size={12}>
            <TextField
              label="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
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
                <MenuItem value="venda">Venda</MenuItem>
                <MenuItem value="producao">Produção</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={6}>
            <TextField
              label={getValueLabel()}
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              fullWidth
            />
          </Grid>

          {type === 'producao' && (
            <Grid size={12}>
              <FormControl fullWidth>
                <InputLabel>Produto</InputLabel>
                <Select
                  value={productId}
                  label="Produto"
                  onChange={(e) => setProductId(e.target.value)}
                >
                  {MOCK_PRODUCTS.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid size={12}>
            <DateInput
              label="Prazo da Meta"
              value={deadline}
              onChange={(date: dayjs.Dayjs | null) => setDeadline(date || dayjs())}
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
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};