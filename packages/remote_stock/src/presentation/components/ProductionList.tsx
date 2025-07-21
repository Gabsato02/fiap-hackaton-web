import React, { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Agriculture, CheckCircle } from '@mui/icons-material';
import type { ProductionListProps } from '../../domain/entities';
import { ConfirmDialog } from 'hostApp/global_components';

export const ProductionList: React.FC<ProductionListProps> = ({
  productions,
  loading,
  onHarvest,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduction, setSelectedProduction] = useState(null);

  const handleOpenDialog = (production) => {
    setSelectedProduction(production);
    setDialogOpen(true);
  };

  const handleConfirmHarvest = () => {
    if (selectedProduction) {
      onHarvest(selectedProduction);
    }
    setDialogOpen(false);
    setSelectedProduction(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) return null;

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Produto</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Quantidade</TableCell>
              <TableCell align="center">Data de Início</TableCell>
              <TableCell align="center">Data da Colheita</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productions.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.productName}</TableCell>
                <TableCell>
                  <Chip
                    icon={p.status === 'harvested' ? <CheckCircle /> : <Agriculture />}
                    label={p.status === 'harvested' ? 'Colhido' : 'Em Produção'}
                    color={p.status === 'harvested' ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">{p.quantity}</TableCell>
                <TableCell align="center">{formatDate(p.creationDate)}</TableCell>
                <TableCell align="center">{formatDate(p.harvestDate)}</TableCell>
                <TableCell align="center">
                  {p.status === 'in_production' && (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleOpenDialog(p)}
                    >
                      Colher
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {productions.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            Nenhuma produção registrada
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Clique em "Adicionar Produção" para começar.
          </Typography>
        </Box>
      )}

      <ConfirmDialog
        open={dialogOpen}
        onCancel={() => setDialogOpen(false)}
        onConfirm={handleConfirmHarvest}
        title="Confirmar Colheita"
        message={`Deseja confirmar a colheita de ${selectedProduction?.quantity} unidades de ${selectedProduction?.productName}? A quantidade será adicionada ao estoque.`}
        confirmText="Sim, Colher"
      />
    </>
  );
};
