import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// components
import Signup from "./components/Signup";
import Login from './components/Login';
import Dashboard from './components/Dashboard';

// context
import { UserAuthContext } from './context/UserAuthContext';

// MUI
import { createTheme, colors, ThemeProvider, responsiveFontSizes } from '@mui/material';
import './index.css';

let theme = createTheme({
  palette: {
    primary: {
      main: colors.pink[500]
    },
    secondary: {
      main: colors.blue[500]
    }
  }
})

function App() {

  let { userAuthState } = useContext(UserAuthContext);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <BrowserRouter>

          <Routes>
            <Route path='/' element={userAuthState.user ? <Dashboard /> : <Navigate to='/login' />} />
            <Route path='/signup' element={userAuthState.user ? <Navigate to='/' /> : <Signup />} />
            <Route path='/login' element={userAuthState.user ? <Navigate to='/' /> : <Login />} />
          </Routes>

        </BrowserRouter>

      </div>
    </ThemeProvider>
  );
}

export default App;
