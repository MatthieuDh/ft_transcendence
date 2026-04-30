import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/*login page redirect*/}
        <Route path="/login" element={<LoginPage />} />

        {/* RergisterPafe redirect */}
        <Route path="/register" element={<RegisterPage />} />

        {/* ProfilePage redirect */}
        <Route path="/profile/:userId" element={<ProfilePage />} />

        {/* for now if you go to an page that does not exist i route to login */} 
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}