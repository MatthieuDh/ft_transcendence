import { useRegister } from '../hooks/useRegister';
import RegisterForm from '../components/registerForm';
import { Link } from 'react-router-dom';

export default function RegisterPage() {
  const { register, error, isLoading } = useRegister();

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        
        <h1 style={{ marginTop: 0, fontSize: '24px', color: '#333' }}>Create an Account</h1>
        <p style={{ marginBottom: '25px', color: '#666', fontSize: '14px', lineHeight: '1.5' }}>
          Please enter your details to set up your workspace.
        </p>
        
        <RegisterForm 
          onSubmit={register} 
          error={error} 
          isLoading={isLoading} 
        />
        
        <p style={{ marginTop: '25px', fontSize: '14px', color: '#666' }}>
          Already have an account? <Link to="/login" style={{ color: '#007bff', textDecoration: 'none', fontWeight: '500' }}>Log in here</Link>
        </p>

      </div>
      
    </div>
  );
}