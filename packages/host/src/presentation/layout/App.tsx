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

type PageName = keyof typeof PAGES; // Resulta em: "login" | "sales" | "stock" | "goals"

export default function App() {
  const { userInfo } = useUserStore();
  const theme = useTheme();

  const [selectedPage, setSelectedPage] = useState<PageName>('sales');

  useEffect(() => {
    if (!userInfo.name) {
      setSelectedPage('login');
    } else {
      setSelectedPage((prev) => (prev === 'login' ? 'sales' : prev));
    }
  }, [userInfo]);

  const renderPage = () => {
    // Agora o TypeScript sabe que `selectedPage` é sempre uma chave válida de `PAGES`.
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
      {/* O tipo de `selectedPage` agora corresponde perfeitamente à prop esperada. */}
      <AppBar onChangePage={setSelectedPage} selectedPage={selectedPage} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: '100%' }}>
        <Toolbar />
        {renderPage()}
      </Box>
    </Container>
  );
}
