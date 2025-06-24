import * as React from 'react';
import Login from 'remoteLogin/Login';
import Sales from 'remoteSales/Sales';
import Stock from 'remoteStock/Stock';
import Goals from 'remoteGoals/Goals';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from './presentation/components/AppBar';
import Toolbar from '@mui/material/Toolbar';

const PAGES = {
  login: <Login />,
  sales: <Sales />,
  stock: <Stock />,
  goals: <Goals />,
};

export default function App() {
  const [selectedPage, setSelectedPage] = React.useState('sales');

  const renderPage = () => {
    return PAGES[selectedPage] || PAGES.sales;
  };

  React.useEffect(() => {
    if (!PAGES[selectedPage]) {
      setSelectedPage('sales');
    }
  }, [selectedPage]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar onChangePage={setSelectedPage} />
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        {renderPage()}
      </Box>
    </Box>
  );
}
