import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { GoalModal } from '../components/GoalModal';
import { GoalsList } from '../components/GoalsList';
import { useUserStore } from 'hostApp/store';
import dayjs from 'dayjs';
import type { Goal } from '../../domain/entities';
import { db } from '../../infrastructure/database';
import {
  editGoal,
  getUserGoals,
  saveGoal,
  deleteGoal,
} from '../../infrastructure/repositories';

export const Goals = () => {
  const { userInfo } = useUserStore();

  const [goals, setGoals] = useState<Goal[]>([]);
  const [openGoalModal, setOpenGoalModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchGoals = async () => {
    if (!userInfo?.id) {
      console.log('❌ UserInfo não encontrado:', userInfo);
      return;
    }
    
    console.log('🔍 Buscando metas para userId:', userInfo.id);
    setLoading(true);
    
    try {
      const resp = await getUserGoals(db, userInfo.id);
      const goalsData = resp.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Goal);
      
      console.log('📊 Metas encontradas:', goalsData);
      console.log('📊 Número de metas:', goalsData.length);
      
      setGoals(goalsData);
    } catch (error) {
      console.error('❌ Erro ao buscar metas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    console.log('🗑️ Deletando meta:', goalId);
    
    try {
      await deleteGoal(db, goalId);
      console.log('✅ Meta deletada com sucesso!');
      await fetchGoals(); // Buscar metas novamente
    } catch (error) {
      console.error('❌ Erro ao deletar meta:', error);
    }
  };

  const handleEditGoal = (goal: Goal) => {
    const $goal = goal;
    $goal.startDate = dayjs(goal.startDate).tz('America/Sao_Paulo').format();
    $goal.endDate = dayjs(goal.endDate).tz('America/Sao_Paulo').format();
    setSelectedGoal($goal);
    setOpenGoalModal(true);
  };

  const handleSaveGoal = async (goal: Goal) => {
    console.log('💾 Salvando meta:', goal);
    
    const payload = goal;

    try {
      if (!payload.id) {
        delete payload.id;
        console.log('➕ Criando nova meta:', payload);
        await saveGoal(db, payload);
      } else {
        console.log('✏️ Editando meta:', payload);
        await editGoal(db, payload.id, payload);
        setSelectedGoal(null);
      }

      console.log('✅ Meta salva com sucesso!');
      await fetchGoals(); // Buscar metas novamente
      handleCloseModal(); // 👈 Fechar o modal após salvar
    } catch (error) {
      console.error('❌ Erro ao salvar meta:', error);
    }
  };

  const handleOpenModal = (goal: Goal | null = null) => {
    setSelectedGoal(goal);
    setOpenGoalModal(true);
  };

  const handleCloseModal = () => {
    setOpenGoalModal(false);
    setSelectedGoal(null);
  };

  useEffect(() => {
    console.log('🚀 Componente Goals carregado');
    console.log('👤 UserInfo:', userInfo);
    fetchGoals();
  }, [userInfo?.id]); // Adicionei dependência do userInfo.id

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
      <GoalsList
        goals={goals}
        onEdit={handleEditGoal}
        onDelete={handleDeleteGoal}
        loading={loading}
      />

      <GoalModal
        open={openGoalModal}
        onClose={handleCloseModal}
        onSave={handleSaveGoal}
        currentGoal={selectedGoal}
      />
    </Box>
  );
};

export default Goals;