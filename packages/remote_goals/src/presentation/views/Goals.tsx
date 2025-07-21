import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { GoalModal } from '../components/GoalModal';
import type { Goal } from '../../domain/entities';

export const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleOpenModal = (goal: Goal | null = null) => {
    setCurrentGoal(goal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentGoal(null);
  };

  const handleSaveGoal = async (goalData: Goal) => {
    try {
      // Por enquanto só console.log
      console.log('Salvando meta:', goalData);
      
      // TODO: Aqui virá a lógica de salvar no Firebase
      // if (goalData.id) {
      //   await updateGoal(db, goalData.id, goalData);
      // } else {
      //   await createGoal(db, goalData);
      // }
      
      // fetchGoals(); // TODO: implementar depois
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
    }
  };

  return (
    <Box>
      <Grid container justifyContent="space-between" alignItems="center" mb={3}>
        <Grid>
          <Typography variant="h4">Gerenciamento de Metas</Typography>
        </Grid>

        <Grid>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => handleOpenModal()}
          >
            Definir nova meta
          </Button>
        </Grid>
      </Grid>

      {/* Lista de metas */}
      {loading ? (
        <Typography>Carregando metas...</Typography>
      ) : (
        <Typography>
          {goals.length === 0 ? 'Nenhuma meta definida ainda.' : `${goals.length} metas encontradas`}
        </Typography>
      )}

      <GoalModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveGoal}
        currentGoal={currentGoal}
      />
    </Box>
  );
};

export default Goals;