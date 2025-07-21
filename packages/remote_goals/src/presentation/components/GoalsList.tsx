import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Grid,
  Stack,
  Divider,
} from '@mui/material';
import { Edit, Delete, Agriculture, PointOfSale } from '@mui/icons-material';
import { ConfirmDialog } from 'hostApp/global_components';
import { Goal } from '../../domain/entities';
import { GoalProgress } from './GoalProgress';

interface GoalsListProps {
  goals: Goal[];
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
  loading?: boolean;
  userId: string;
}

export const GoalsList: React.FC<GoalsListProps> = ({
  goals,
  onEdit,
  onDelete,
  loading = false,
  userId,
}) => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [goalToDelete, setGoalToDelete] = React.useState<string | null>(null);

  const handleDeleteClick = (goalId: string) => {
    setGoalToDelete(goalId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (goalToDelete) {
      onDelete(goalToDelete);
      setGoalToDelete(null);
    }
    setDeleteConfirmOpen(false);
  };

  const handleDeleteCancel = () => {
    setGoalToDelete(null);
    setDeleteConfirmOpen(false);
  };

  const getTypeLabel = (type: 'sales' | 'production') => (type === 'sales' ? 'Vendas' : 'Produção');
  const getTypeColor = (type: 'sales' | 'production') =>
    type === 'sales' ? 'primary' : 'secondary';
  const getTypeIcon = (type: 'sales' | 'production') =>
    type === 'sales' ? <PointOfSale fontSize="small" /> : <Agriculture fontSize="small" />;

  const formatValue = (value: number, type: string) => {
    if (type === 'sales') {
      return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    }
    return `${value.toLocaleString('pt-BR')} Unidades`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  if (loading) {
    return <Typography sx={{ textAlign: 'center', mt: 4 }}>Carregando metas...</Typography>;
  }

  if (goals.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" color="text.secondary">
          Nenhuma meta definida ainda
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Clique em "Definir nova meta" para começar
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {goals.map((goal) => (
          <Grid item xs={12} md={6} lg={4} key={goal.id}>
            <Card elevation={2} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack spacing={1.5}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="h6" component="div" flex={1} noWrap>
                      {goal.title}
                    </Typography>
                    <Box>
                      <IconButton size="small" onClick={() => onEdit(goal)} color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(goal.id!)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>

                  <Chip
                    icon={getTypeIcon(goal.type)}
                    label={getTypeLabel(goal.type)}
                    color={getTypeColor(goal.type)}
                    size="small"
                    sx={{ width: 'fit-content' }}
                  />

                  {goal.type === 'production' && (
                    <Typography variant="caption" color="text.secondary">
                      Produto: <strong>{goal.productName}</strong>
                    </Typography>
                  )}

                  <Divider />

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Meta:
                    </Typography>
                    <Typography variant="h5" color={getTypeColor(goal.type)}>
                      {formatValue(goal.targetValue, goal.type)}
                    </Typography>
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    Período: {formatDate(goal.startDate)} - {formatDate(goal.endDate)}
                  </Typography>

                  <GoalProgress goal={goal} userId={userId} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Excluir Meta"
        message="Tem certeza de que deseja excluir esta meta? Esta ação não pode ser desfeita."
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </Box>
  );
};
