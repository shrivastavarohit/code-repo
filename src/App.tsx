import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Dashboard from './Dashboard';
import type { RootState } from './store/store';

function App() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return (
    <Router>
      <Routes>
        <Route
          path='/login'
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : (
              <Navigate to='/dashboard' replace />
            )
          }
        />
        <Route
          path='/register'
          element={
            !isAuthenticated ? (
              <RegisterPage />
            ) : (
              <Navigate to='/dashboard' replace />
            )
          }
        />
        <Route
          path='/dashboard'
          element={
            isAuthenticated ? <Dashboard /> : <Navigate to='/login' replace />
          }
        />
        <Route
          path='/'
          element={
            <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
