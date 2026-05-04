import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import ProjectPage from './pages/ProjectPage';
import Layout from './components/layout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* add pages here to add the sidebar and topbar */}
        <Route element={<Layout />}>
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/project/:projectId" element={<ProjectPage />} />
        </Route>

        {/* normal pages like login and registern */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* standard route to register */} 
        <Route path="*" element={<Navigate to="/login" />} />
        
      </Routes>
    </BrowserRouter>
  );
}