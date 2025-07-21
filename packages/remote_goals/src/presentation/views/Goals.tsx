import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { GoalModal } from '../components/GoalModal';
import { GoalsList } from '../components/GoalsList';
import { GoalNotification } from '../components/GoalNotification';
import { useUserStore, useProductsStore } from 'hostApp/store';
import { Goal } from '../../domain/entities';
import { StockProduct } from 'hostApp/types';
import { db } from '../../infrastructure/database';
import {
  editGoal,
  getUserGoals,
  saveGoal,
  deleteGoal,
  getAllStockProducts,
} from '../../infrastructure/repositories';

export const Goals = () => {
  const { userInfo } = useUserStore();
  const { setStockProducts } = useProductsStore();

  const [goals, setGoals] = useState<Goal[]>([]);
  const [openGoalModal, setOpenGoalModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(false);

  const [showNotification, setShowNotification] = useState(false);
  const [completedGoal, setCompletedGoal] = useState<Goal | null>(null);

  const fetchGoals = useCallback(async () => {
    if (!userInfo?.id) return;
    setLoading(true);
    try {
      const resp = await getUserGoals(db, userInfo.id);
      const goalsData = resp.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Goal);
      setGoals(goalsData);
    } catch (error) {
      console.error('❌ Erro ao buscar metas:', error);
    } finally {
      setLoading(false);
    }
  }, [userInfo.id]);

  const fetchProducts = useCallback(async () => {
    try {
      const snapshot = await getAllStockProducts(db);
      const productsData = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as StockProduct,
      );
      setStockProducts(productsData);
    } catch (error) {
      console.error('Erro ao buscar produtos de estoque:', error);
    }
  }, [setStockProducts]);

  useEffect(() => {
    if (userInfo?.id) {
      fetchGoals();
      fetchProducts();
    }
  }, [userInfo?.id, fetchGoals, fetchProducts]);

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await deleteGoal(db, goalId);
      fetchGoals();
    } catch (error) {
      console.error('❌ Erro ao deletar meta:', error);
    }
  };

  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setOpenGoalModal(true);
  };

  const handleSaveGoal = async (goal: Goal) => {
    const payload = goal;
    try {
      if (!payload.id) {
        delete payload.id;
        await saveGoal(db, payload);
      } else {
        await editGoal(db, payload.id, payload);
      }
      fetchGoals();
    } catch (error) {
      console.error('❌ Erro ao salvar meta:', error);
    } finally {
      setOpenGoalModal(false);
      setSelectedGoal(null);
    }
  };

  return (
    <Box>
      <Grid container justifyContent="space-between" alignItems="center" mb={3}>
        <Grid item>
          <Typography variant="h4">Gerenciamento de Metas</Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => setOpenGoalModal(true)}
          >
            Definir nova meta
          </Button>
        </Grid>
      </Grid>

      <GoalsList
        goals={goals}
        onEdit={handleEditGoal}
        onDelete={handleDeleteGoal}
        loading={loading}
        userId={userInfo?.id || ''}
      />

      <GoalModal
        open={openGoalModal}
        onClose={() => {
          setOpenGoalModal(false);
          setSelectedGoal(null);
        }}
        onSave={handleSaveGoal}
        currentGoal={selectedGoal}
      />

      <GoalNotification
        open={showNotification}
        goalTitle={completedGoal?.title || ''}
        targetValue={completedGoal?.targetValue || 0}
        onClose={() => setShowNotification(false)}
      />
    </Box>
  );
};

export default Goals;
