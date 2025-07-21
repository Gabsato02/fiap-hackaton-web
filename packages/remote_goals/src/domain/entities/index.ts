export interface Goal {
  id?: string;
  title: string;
  description: string;
  type: 'venda' | 'producao';
  value: number; 
  product_id?: string; 
  product_name?: string; 
  deadline: string;
  created_at: string;
  status: 'active' | 'completed' | 'overdue';
  user_id: string;
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