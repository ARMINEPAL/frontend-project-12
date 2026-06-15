import { Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';

const App = () => (
  <Routes>
    <Route path="/" element={<div>Главная</div>} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="*" element={<div>404</div>} />
  </Routes>
);

export default App;