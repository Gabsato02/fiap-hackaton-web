import { createTheme } from "@mui/material";

const mainTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4CAF50', // verde planta
      contrastText: '#fff',
    },
    secondary: {
      main: '#8D6E63', // marrom terra
      contrastText: '#fff',
    },
    success: {
      main: '#388E3C', // verde escuro
    },
    error: {
      main: '#D32F2F', // vermelho ferrugem
    },
    warning: {
      main: '#FBC02D', // amarelo sol
    },
    info: {
      main: '#1976D2', // azul céu
    },
    background: {
      default: '#F5F5DC', // areia clara
      paper: '#ffffff',
    },
    text: {
      primary: '#3E2723', // marrom escuro
    },
  },
  typography: {
    fontFamily: `'Roboto', 'Arial', sans-serif`,
  },
});

export { mainTheme };