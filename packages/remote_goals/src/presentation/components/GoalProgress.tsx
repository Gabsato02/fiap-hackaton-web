import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Card,
  CardContent,
  Stack,
  Chip,
} from '@mui/material';
import { Goal } from '../../domain/entities';
import { getSalesByPeriod } from '../../infrastructure/repositories';
import { db } from '../../infrastructure/database';

interface GoalProgressProps {
  goal: Goal;
  userId: string;
}

interface Sale {
  id: string;
  date: string;
  total_price: number;
  product_price: number;
  product_quantity: number;
  product_id: string;
  seller_id: string;
  product_name?: string;
}

export const GoalProgress: React.FC<GoalProgressProps> = ({ goal, userId }) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        
        const salesSnapshot = await getSalesByPeriod(
          db,
          userId,
          goal.startDate,
          goal.endDate
        );
        
        let totalValue = 0;
        
        salesSnapshot.docs.forEach((doc) => {
          const sale = doc.data() as Sale;
          
          if (goal.type === 'sales') {
            // Para metas de vendas, somar o total_price
            totalValue += sale.total_price || 0;
          } else if (goal.type === 'production') {
            // Para metas de produção, somar a quantidade de produtos específicos
            // (assumindo que você vai adicionar product_id na meta depois)
            totalValue += sale.product_quantity || 0;
          }
        });
        
        console.log('📈 Progresso calculado:', { 
          goalId: goal.id, 
          type: goal.type, 
          currentValue: totalValue, 
          targetValue: goal.targetValue 
        });
        
        setCurrentValue(totalValue);
      } catch (error) {
        console.error('❌ Erro ao calcular progresso:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [goal, userId]);

  const progressPercentage = Math.min((currentValue / goal.targetValue) * 100, 100);
  const isCompleted = currentValue >= goal.targetValue;

  const formatValue = (value: number) => {
    if (goal.type === 'sales') {
      return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    }
    return `${value} unidades`;
  };

  const getProgressColor = () => {
    if (isCompleted) return 'success';
    if (progressPercentage >= 70) return 'warning';
    return 'primary';
  };

  return (
    <Box mt={2}>
      <Stack spacing={1}>
        {/* Status */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Progresso da Meta
          </Typography>
          <Chip 
            label={isCompleted ? 'Concluída' : 'Em andamento'} 
            color={isCompleted ? 'success' : 'default'}
            size="small"
          />
        </Box>

        {/* Valores */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2">
            {formatValue(currentValue)} / {formatValue(goal.targetValue)}
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {progressPercentage.toFixed(1)}%
          </Typography>
        </Box>

        {/* Barra de progresso */}
        <LinearProgress
          variant={loading ? 'indeterminate' : 'determinate'}
          value={progressPercentage}
          color={getProgressColor()}
          sx={{ 
            height: 8, 
            borderRadius: 4,
            backgroundColor: 'grey.200'
          }}
        />

        {/* Período */}
        <Typography variant="caption" color="text.secondary">
          Período: {new Date(goal.startDate).toLocaleDateString('pt-BR')} - {new Date(goal.endDate).toLocaleDateString('pt-BR')}
        </Typography>
      </Stack>
    </Box>
  );
};
