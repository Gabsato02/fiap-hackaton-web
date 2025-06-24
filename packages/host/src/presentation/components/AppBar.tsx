import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Drawer from './Drawer';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import { MainAppBarProps } from '../../domain/entities';

export default function MainAppBar({ onChangePage }: MainAppBarProps) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Drawer onChangePage={onChangePage} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            FIAP Farms
          </Typography>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="logout"
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
