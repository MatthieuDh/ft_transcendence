import { useLogin } from '../hooks/useLogin';
import LoginForm from '../components/loginForm';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  const { login, error, isLoading } = useLogin();

  return (
    <div style={{ 
      minHeight: '100vh',          
      backgroundColor: '#f604ee',   
      display: 'flex',              
      flexDirection: 'column',
      alignItems: 'center',         
      justifyContent: 'center',     
    }}>
      <h1>Sign In</h1>
      <p style={{ marginBottom: '20px', color: '#00ff00' }}>
        Welcome to sigma.
        the best and only task management system by matthieu, giovanni, danielle and siebe!
      </p>
      
      <LoginForm 
        onSubmit={login} 
        error={error} 
        isLoading={isLoading} 
      />
      <p style={{ marginTop: '25px', fontSize: '14px', color: '#666' }}>
          Don't have an account yet? <Link to="/register" style={{ color: '#007bff', textDecoration: 'none', fontWeight: '500' }}>Sign up here</Link>
        </p>
    </div>
  );
}