import * as React from 'react';
import Login from 'remoteLogin/Login';
import Sales from 'remoteSales/Sales';
import Stock from 'remoteStock/Stock';
import Goals from 'remoteGoals/Goals';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '../components/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useUserStore } from '../../store';

const PAGES = {
  login: <Login />,
  sales: <Sales />,
  stock: <Stock />,
  goals: <Goals />,
};

export default function App() {
  const { userInfo } = useUserStore();
  const [selectedPage, setSelectedPage] = React.useState('sales');

  React.useEffect(() => {
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
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <CssBaseline />
      <AppBar onChangePage={setSelectedPage} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: '100%' }}>
        <Toolbar />
        {renderPage()}
      </Box>
    </Box>
  );
}
