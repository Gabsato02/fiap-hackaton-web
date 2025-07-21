export interface Goal {
  id?: string;
  title: string;
  type: 'sales' | 'production';
  targetValue: number;
  currentValue?: number;
  startDate: string;
  endDate: string;
  userId: string;
  isCompleted?: boolean;
  completedAt?: string;
  notified?: boolean;
  productId?: string;
  productName?: string;
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
  userId: string;
}
