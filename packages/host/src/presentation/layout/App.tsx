import React from 'react';
import { useState, useEffect } from 'react';
import Login from 'remoteLogin/Login';
import Sales from 'remoteSales/Sales';
import Stock from 'remoteStock/Stock';
import Goals from 'remoteGoals/Goals';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppBar from '../components/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useUserStore } from '../../store';
import { useTheme } from '@mui/material';

const PAGES = {
  login: <Login />,
  sales: <Sales />,
  stock: <Stock />,
  goals: <Goals />,
};

export default function App() {
  const { userInfo } = useUserStore();
  const theme = useTheme();
  const [selectedPage, setSelectedPage] = useState('sales');

  useEffect(() => {
    if (!userInfo.name) {
      setSelectedPage('login');
    } else {
      setSelectedPage((prev) => (prev === 'login' ? 'sales' : prev));
    }
  }, [userInfo]);

  const renderPage = () => {
    return PAGES[selectedPage] || PAGES.sales;
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        height: '100%',
        bgcolor: theme.palette.background.default,
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <CssBaseline />
      <AppBar onChangePage={setSelectedPage} selectedPage={selectedPage} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: '100%' }}>
        <Toolbar />
        {renderPage()}
      </Box>
    </Container>
  );
}
