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
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { ConfirmDialog } from 'hostApp/global_components';
import { Goal } from '../../domain/entities';
import { GoalProgress } from './GoalProgress';

interface GoalsListProps {
  goals: Goal[];
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
  loading?: boolean;
  userId: string; // ← Adicionado userId
}

export const GoalsList: React.FC<GoalsListProps> = ({
  goals,
  onEdit,
  onDelete,
  loading = false,
  userId, // ← Recebendo userId
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

  const getTypeLabel = (type: string) => {
    return 'Vendas'; 
  };

  const getTypeColor = (type: string) => {
    return 'primary'; 
  };

  const formatValue = (value: number, type: string) => {
    // Sempre formato de vendas em reais
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return <Typography>Carregando metas...</Typography>;
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
      <Typography variant="h6" mb={2}>
        {goals.length} {goals.length === 1 ? 'meta encontrada' : 'metas encontradas'}
      </Typography>

      <Grid container spacing={2}>
        {goals.map((goal) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={goal.id}>
            <Card elevation={2}>
              <CardContent>
                <Stack spacing={2}>
                  {/* Header com título e ações */}
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="h6" component="div" flex={1}>
                      {goal.title}
                    </Typography>
                    <Box>
                      <IconButton 
                        size="small" 
                        onClick={() => onEdit(goal)}
                        color="primary"
                      >
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

                  {/* Tipo */}
                  <Box>
                    <Chip 
                      label={getTypeLabel(goal.type)} 
                      color={getTypeColor(goal.type) as any}
                      size="small"
                    />
                  </Box>

                  {/* Valor */}
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Meta:
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {formatValue(goal.targetValue, goal.type)}
                    </Typography>
                  </Box>

                  {/* Datas */}
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Período:
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(goal.startDate)} - {formatDate(goal.endDate)}
                    </Typography>
                  </Box>

                  {/* Progresso da Meta */}
                  <GoalProgress goal={goal} userId={userId} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog de confirmação de exclusão */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Excluir Meta"
        message="Tem certeza de que deseja excluir esta meta? Esta ação não pode ser desfeita."
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmText="Excluir"
        cancelText="Cancelar"
        severity="error"
      />
    </Box>
  );
};
