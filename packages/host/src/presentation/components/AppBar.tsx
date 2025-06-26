import { useState } from 'react';
import { getAuth, signOut } from "firebase/auth";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Drawer from './Drawer';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import CircularProgress from '@mui/material/CircularProgress';
import { MainAppBarProps, UserInfo } from '../../domain/entities';
import { useUserStore } from '../../store';
import { ConfirmDialog } from '../global_components/index.ts';

export default function MainAppBar({ onChangePage, selectedPage }: MainAppBarProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const { userInfo, setUserInfo } = useUserStore();
  const [loading, setLoading] = useState(false);  

  const handleSignout = async () => {
    const auth = getAuth();
    setLoading(true);

    try {
      await signOut(auth);
        
      setTimeout(() => {
        setUserInfo({} as UserInfo);

        onChangePage('login');

        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed">
          <Toolbar>
            {(!!Object.keys(userInfo).length && <Drawer onChangePage={onChangePage} selectedPage={selectedPage} />)}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              FIAP Farms
            </Typography>
            {(!!Object.keys(userInfo).length && <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="logout"
              onClick={() => setOpenDialog(true)}
              loading={loading}
              loadingIndicator={<CircularProgress style={{color: 'white'}} size={16} />}
            >
              <LogoutIcon />
            </IconButton>)}
          </Toolbar>
        </AppBar>
      </Box>
      <ConfirmDialog
        open={openDialog}
        title="Deslogar"
        message="Deseja sair? Você precisará fazer login novamente para acessar o sistema."
        confirmText="Sim, deslogar"
        cancelText="Cancelar"
        onConfirm={handleSignout}
        onCancel={() => setOpenDialog(false)}
      />
    </>
  );
}
