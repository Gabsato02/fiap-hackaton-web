import React from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  Box,
  Typography,
} from '@mui/material';
import { CheckCircle, EmojiEvents } from '@mui/icons-material';

interface GoalNotificationProps {
  open: boolean;
  goalTitle: string;
  targetValue: number;
  onClose: () => void;
}

export const GoalNotification: React.FC<GoalNotificationProps> = ({
  open,
  goalTitle,
  targetValue,
  onClose,
}) => {
  const formatValue = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={8000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity="success"
        variant="filled"
        icon={<EmojiEvents />}
        sx={{
          width: '100%',
          '& .MuiAlert-icon': {
            fontSize: '2rem',
          },
        }}
      >
        <AlertTitle sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
          🎉 Parabéns! Meta Atingida!
        </AlertTitle>
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            "{goalTitle}"
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            Valor alcançado: {formatValue(targetValue)}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic' }}>
            Continue assim! 💪
          </Typography>
        </Box>
      </Alert>
    </Snackbar>
  );
};
