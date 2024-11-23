import { createTheme, ThemeProvider } from '@mui/material';
import './App.css';
import Dashboard from './components/Dashboard/Dashboard';

const theme = createTheme({
  typography: {
    fontSize: 14,
    h6: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    body2: {
      fontSize: '1rem',
    },
  },
});

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Dashboard />
      </ThemeProvider>
    </>
  );
}

export default App;
