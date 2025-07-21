import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress, Stack, Chip } from '@mui/material';
import { Goal } from '../../domain/entities';
import { getSalesByPeriod, getProductionsByPeriod } from '../../infrastructure/repositories';
import { db } from '../../infrastructure/database';
import type { Sale, Production } from 'hostApp/types';

interface GoalProgressProps {
  goal: Goal;
  userId: string;
}

export const GoalProgress: React.FC<GoalProgressProps> = ({ goal, userId }) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true);
      let totalValue = 0;

      try {
        if (goal.type === 'sales') {
          const salesSnapshot = await getSalesByPeriod(db, userId, goal.startDate, goal.endDate);
          salesSnapshot.docs.forEach((doc) => {
            const sale = doc.data() as Sale;
            totalValue += sale.total_price || 0;
          });
        } else if (goal.type === 'production' && goal.productId) {
          const productionsSnapshot = await getProductionsByPeriod(
            db,
            userId,
            goal.startDate,
            goal.endDate,
            goal.productId,
          );
          productionsSnapshot.docs.forEach((doc) => {
            const production = doc.data() as Production;
            totalValue += production.quantity || 0;
          });
        }
        setCurrentValue(totalValue);
      } catch (error) {
        console.error('❌ Erro ao calcular progresso:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [goal, userId]);

  const progressPercentage =
    goal.targetValue > 0 ? Math.min((currentValue / goal.targetValue) * 100, 100) : 0;
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
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2">
            {formatValue(currentValue)} / {formatValue(goal.targetValue)}
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {progressPercentage.toFixed(1)}%
          </Typography>
        </Box>
        <LinearProgress
          variant={loading ? 'indeterminate' : 'determinate'}
          value={progressPercentage}
          color={getProgressColor()}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Stack>
    </Box>
  );
};
