import { useState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { ConfirmDialog } from "hostApp/global_components";

export const SalesCard = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleDeleteSale = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={6}>
              <Typography gutterBottom variant="h6">
                Produto
              </Typography>
            </Grid>
            <Grid size={6}>
              <Typography sx={{ color: 'text.secondary', textAlign: "right" }}>Data</Typography>
            </Grid>
            <Grid size={6}>
              <Typography variant="overline" sx={{ color: 'text.secondary' }}>Quantidade vendida</Typography>
            </Grid>
            <Grid size={6}>
              <Typography sx={{ color: 'text.secondary', textAlign: "right" }}>Valor</Typography>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end"}}>
          <Button color="info" variant="contained" size="small">Editar</Button>
          <Button color="error" size="small" onClick={() => setOpenDialog(true)}>Excluir</Button>
        </CardActions>
      </Card>
      <ConfirmDialog
        open={openDialog}
        title="Tem certeza?"
        message="Deseja realmente excluir esta venda? Esta ação não poderá ser desfeita."
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        onConfirm={handleDeleteSale}
        onCancel={() => setOpenDialog(false)}
      />
    </>
  );
};