import { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import LoginPage from './LoginPage.jsx';
import ChatPage from './ChatPage.jsx';
import NotFoundPage from './NotFoundPage.jsx'
import AuthContext from '../contexts/index.jsx';
import useAuth from '../hooks/index.jsx';

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem('userId')),
  );

  const logIn = () => setLoggedIn(true);

  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  return auth.loggedIn
    ? children
    : <Navigate to="/login" state={{ from: location }} />;
};

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route
          path="/"
          element={(
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          )}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path = '*' element = { <NotFoundPage/>}/>
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;