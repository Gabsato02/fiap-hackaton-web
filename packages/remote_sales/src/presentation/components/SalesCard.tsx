import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { ConfirmDialog } from 'hostApp/global_components';
import { SalesCardProps } from '../../domain/entities';

export const SalesCard: React.FC<SalesCardProps> = ({ sale, onDelete, onEdit }) => {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ px: 3, py: 2 }}>
          <Grid container spacing={2}>
            <Grid size={6}>
              <Typography gutterBottom variant="h6" color="primary">
                { sale.product_name }
              </Typography>
            </Grid>
            <Grid size={6}>
              <Typography sx={{ color: 'text.secondary', textAlign: 'right' }}>
                Data: {new Date(sale.date).toLocaleDateString('pt-BR')}
              </Typography>
            </Grid>
            <Grid size={6}>
              <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                Quantidade: {sale.product_quantity}
              </Typography>
            </Grid>
            <Grid size={6}>
              <Typography sx={{ color: 'text.secondary', textAlign: 'right' }}>
                Valor: R$ {Number(sale.total_price).toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button color="secondary" variant="contained" size="small" onClick={() => onEdit(sale)}>
            Editar
          </Button>
          <Button color="error" size="small" onClick={() => setOpenDialog(true)}>
            Excluir
          </Button>
        </CardActions>
      </Card>
      <ConfirmDialog
        open={openDialog}
        title="Tem certeza?"
        message="Deseja realmente excluir esta venda? Esta ação não poderá ser desfeita."
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        onConfirm={onDelete}
        onCancel={() => setOpenDialog(false)}
      />
    </>
  );
};
