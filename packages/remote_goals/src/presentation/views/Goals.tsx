import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { GoalModal } from '../components/GoalModal';
import { GoalsList } from '../components/GoalsList';
import { GoalNotification } from '../components/GoalNotification';
import { useUserStore } from 'hostApp/store';
import dayjs from 'dayjs';
import type { Goal } from '../../domain/entities';
import { db } from '../../infrastructure/database';
import {
  editGoal,
  getUserGoals,
  saveGoal,
  deleteGoal,
  getSalesByPeriod,
} from '../../infrastructure/repositories';

export const Goals = () => {
  const { userInfo } = useUserStore();

  const [goals, setGoals] = useState<Goal[]>([]);
  const [openGoalModal, setOpenGoalModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Estados para notificação
  const [showNotification, setShowNotification] = useState(false);
  const [completedGoal, setCompletedGoal] = useState<Goal | null>(null);

  // Função para verificar metas completadas e mostrar notificação
  const checkCompletedGoals = (goalsData: Goal[]) => {
    const previousGoals = goals; // Metas anteriores
    
    goalsData.forEach(currentGoal => {
      const currentValue = currentGoal.currentValue || 0;
      const isNowCompleted = currentValue >= currentGoal.targetValue;
      
      // Buscar a meta anterior para comparar
      const previousGoal = previousGoals.find(g => g.id === currentGoal.id);
      const wasCompleted = previousGoal ? (previousGoal.currentValue || 0) >= previousGoal.targetValue : false;
      
      // Se a meta acabou de ser completada E ainda não foi notificada
      if (isNowCompleted && !wasCompleted && !currentGoal.notified) {
        console.log('🎉 Meta completada!', currentGoal.title);
        setCompletedGoal(currentGoal);
        setShowNotification(true);
        
        // Marcar como notificada no banco
        markGoalAsNotified(currentGoal);
      }
    });
  };

  // Função para marcar meta como notificada
  const markGoalAsNotified = async (goal: Goal) => {
    try {
      const updatedGoal = {
        ...goal,
        notified: true,
        isCompleted: true,
        completedAt: new Date().toISOString(),
      };
      
      if (goal.id) {
        await editGoal(db, goal.id, updatedGoal);
        console.log('✅ Meta marcada como notificada');
      }
    } catch (error) {
      console.error('❌ Erro ao marcar meta como notificada:', error);
    }
  };

  // Função para calcular o progresso atual das metas
  const calculateGoalProgress = async (goalsData: Goal[]): Promise<Goal[]> => {
    const updatedGoals = await Promise.all(
      goalsData.map(async (goal) => {
        try {
          const salesSnapshot = await getSalesByPeriod(
            db,
            userInfo?.id || '',
            goal.startDate,
            goal.endDate
          );
          
          let currentValue = 0;
          
          salesSnapshot.docs.forEach((doc) => {
            const sale = doc.data() as any;
            if (goal.type === 'sales') {
              currentValue += sale.total_price || 0;
            }
          });
          
          const isCompleted = currentValue >= goal.targetValue;
          
          // Atualizar a meta no banco com o currentValue
          const updatedGoal = {
            ...goal,
            currentValue,
            isCompleted,
          };
          
          if (goal.id) {
            await editGoal(db, goal.id, updatedGoal);
          }
          
          return updatedGoal;
        } catch (error) {
          console.error('❌ Erro ao calcular progresso da meta:', goal.id, error);
          return goal;
        }
      })
    );
    
    return updatedGoals;
  };

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
      
      // Calcular progresso atual das metas
      const updatedGoals = await calculateGoalProgress(goalsData);
      
      // Verificar se alguma meta foi completada
      checkCompletedGoals(updatedGoals);
      
      setGoals(updatedGoals);
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

  const handleCloseNotification = () => {
    setShowNotification(false);
    setCompletedGoal(null);
  };

  useEffect(() => {
    console.log('🚀 Componente Goals carregado');
    console.log('👤 UserInfo:', userInfo);
    fetchGoals();
  }, [userInfo?.id]); // Adicionei dependência do userInfo.id

  // Verificar progresso das metas a cada 30 segundos
  useEffect(() => {
    if (!userInfo?.id) return;

    const interval = setInterval(() => {
      console.log('🔄 Verificando progresso das metas automaticamente...');
      fetchGoals();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [userInfo?.id]);

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
        userId={userInfo?.id || ''}
      />

      <GoalModal
        open={openGoalModal}
        onClose={handleCloseModal}
        onSave={handleSaveGoal}
        currentGoal={selectedGoal}
      />

      {/* Notificação de meta atingida */}
      <GoalNotification
        open={showNotification}
        goalTitle={completedGoal?.title || ''}
        targetValue={completedGoal?.targetValue || 0}
        onClose={handleCloseNotification}
      />
    </Box>
  );
};

export default Goals;