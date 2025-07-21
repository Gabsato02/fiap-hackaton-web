export interface Goal {
  id?: string;
  title: string;
  type: 'production' | 'sales';
  targetValue: number;
  startDate: string; // timestamp
  endDate: string; // timestamp  
  userId: string;
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