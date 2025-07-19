import React, { useState } from 'react';
import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { StockListProps } from '../../domain/entities';
import { ConfirmDialog } from 'hostApp/global_components';

export const StockList: React.FC<StockListProps> = ({ products, onEdit, onDelete, loading }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const openConfirmDialog = (id: string) => {
    setSelectedProductId(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedProductId) {
      onDelete(selectedProductId);
    }
    setDialogOpen(false);
    setSelectedProductId(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography fontWeight="bold">Produto</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography fontWeight="bold">Preço (R$)</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography fontWeight="bold">Quantidade</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography fontWeight="bold">Ações</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell align="right">{product.price.toFixed(2)}</TableCell>
                <TableCell align="right">{product.quantity}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => onEdit(product)} color="secondary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => openConfirmDialog(product.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmDialog
        open={dialogOpen}
        onCancel={() => setDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
      />
    </>
  );
};
