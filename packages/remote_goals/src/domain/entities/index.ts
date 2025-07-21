export interface Goal {
  id?: string;
  title: string;
  type: 'sales'; // Fixo como vendas
  targetValue: number;
  currentValue?: number; // Valor atual alcançado
  startDate: string; // timestamp
  endDate: string; // timestamp  
  userId: string;
  isCompleted?: boolean; // Se a meta foi concluída
  completedAt?: string; // Quando foi concluída
  notified?: boolean; // Se já foi notificado sobre a conclusão
}

export interface GoalModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (goal: Goal) => void;
  currentGoal: Goal | null;
}

export interface GoalsListProps {
  goals: Goal[];
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
  loading: boolean;
}