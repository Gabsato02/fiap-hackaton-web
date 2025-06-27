import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Alert,
} from '@mui/material';
import { ConfirmDialogProps } from '../../domain/entities';

export default function ConfirmDialog({
  open,
  title = 'Confirmação',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirmClick = async () => {
    try {
      setLoading(true);
      setError(null);
      await onConfirm();
    } catch (err) {
      setError(err?.message || 'Ocorreu um erro ao confirmar.');
      return;
    } finally {
      setLoading(false);
    }

    onCancel();
  };

  const handleCancelClick = () => {
    if (!loading) {
      setError(null);
      onCancel();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancelClick}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description">{message}</DialogContentText>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelClick} color="inherit" disabled={loading}>
          {cancelText}
        </Button>
        <Button
          loading={loading}
          onClick={handleConfirmClick}
          color="primary"
          variant="contained"
          autoFocus
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
