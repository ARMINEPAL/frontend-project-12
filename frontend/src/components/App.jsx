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
import SignupPage from './SignupPage.jsx'
import NotFoundPage from './NotFoundPage.jsx'
import AuthContext from '../contexts/index.jsx';
import useAuth from '../hooks/index.jsx';
import Header from './Header.jsx';
import { ToastContainer } from 'react-toastify'

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

const App = () => {
    return (
  <AuthProvider>
    <Router>
    <Header/>
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
        <Route path="/signup" element={<SignupPage />} />
        <Route path = '*' element = { <NotFoundPage/>}/>
      </Routes>
      <ToastContainer />
    </Router>
  </AuthProvider>
)}

export default App;