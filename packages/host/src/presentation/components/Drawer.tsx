import { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import InventoryIcon from '@mui/icons-material/Inventory';
import FlagIcon from '@mui/icons-material/Flag';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Divider from '@mui/material/Divider';
import { MainAppBarProps, RemoteProjects } from '../../domain/entities';
import { useUserStore } from '../../store';
import Avatar from '@mui/material/Avatar';

export default function MainDrawer({ onChangePage }: MainAppBarProps) {
  const [open, setOpen] = useState(false);
  const { userInfo } = useUserStore();  

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleItemClick = (id: string) => {
    onChangePage(id);
  };

  const DRAWER_LIST: RemoteProjects[] = [
    {
      route: 'sales',
      text: 'Vendas',
      icon: <PointOfSaleIcon />
    },
    {
      route: 'stock',
      text: 'Estoque',
      icon: <InventoryIcon />
    },
    {
      route: 'goals',
      text: 'Metas',
      icon: <FlagIcon />   
    }
  ];

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        <ListItem sx={{ paddingY: 2, gap: 2 }}>
          <Avatar alt={userInfo.name} src={userInfo.photoURL} />
          <ListItemText primary={userInfo.name} />
        </ListItem>
        <Divider sx={{ marginBottom: 2 }} />
        {DRAWER_LIST.map(({ text, icon, route }) => (
          <ListItem key={route} disablePadding onClick={() => handleItemClick(route)}  >
            <ListItemButton>
              <ListItemIcon>
                {icon}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2 }}
        onClick={toggleDrawer(true)}
      >
        <MenuIcon />
      </IconButton>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
