import { useState } from 'react';
import {
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AuthContext from '../contexts/index.jsx';
import ChatPage from './ChatPage.jsx';
import Header from './Header.jsx';
import LoginPage from './LoginPage.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import SignupPage from './SignupPage.jsx';
import PrivateRoute from './PrivateRoute.jsx';

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


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column h-100">
          <Header />
          <div className="container h-100 my-4 overflow-hidden rounded shadow">
            <Routes>
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <ChatPage />
                  </PrivateRoute>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </div>
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
};

export default App;
