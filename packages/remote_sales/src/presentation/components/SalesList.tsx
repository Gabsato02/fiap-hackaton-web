import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';
import { SalesCard } from './SalesCard';

export const SalesList = () => {
  return (
    <List
      sx={{ width: '100%', bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader" sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Vendas
          </Typography>
        </ListSubheader>
      }
    >
      <SalesCard />
    </List>
  )
}