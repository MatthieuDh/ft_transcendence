import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import ProjectPage from './pages/ProjectPage';
import Layout from './components/layout';
import MainPage from './pages/MainPage';
import LandingPage from './pages/LandingPage';
import { useEffect, useState, type ReactNode } from 'react';
import { authService } from './api/services';
import { Flex, Spinner } from '@chakra-ui/react';
import ProtectedRoute from './components/protectedRoute';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import ConditionalLayout from './components/ConditionalLayout';
import { SocketProvider } from './context/SocketContext';
import { useAuth } from './context/AuthContext';

function SocketWrapper({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  return <SocketProvider currentUserId={currentUser?.id}>{children}</SocketProvider>;
}

function LandingGate() {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (currentUser) {
    return <Navigate to="/main" replace />;
  }

  return <LandingPage />;
}

export default function App() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    authService.initialize().finally(() => setReady(true));
  }, []);

  if (!ready) return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Spinner size="xl" />
    </Flex>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingGate />} />

        {/* Public routes wrapped by ConditionalLayout - will render Layout if token exists */}
        <Route element={<ConditionalLayout />}>
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        </Route>

        {/* add pages here to add the sidebar and topbar */}
        <Route element={<ProtectedRoute />}>
          <Route element={<SocketWrapper><Layout /></SocketWrapper>}>
            <Route path="/main" element={<MainPage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/project/:projectId" element={<ProjectPage />} />
          </Route>
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
