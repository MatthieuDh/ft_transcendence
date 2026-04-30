import { useState } from 'react';

interface LoginFormProps{
    onSubmit: (username:string, password:string) => void
    error?: string;
    isLoading: boolean
}

export default function LoginForm({ onSubmit, error, isLoading }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.SyntheticEvent) => {
  e.preventDefault();
  onSubmit(username, password);
};
return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '300px' }}>
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      
      <div>
        <label>Username:</label>
        <input 
          type="text" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
      
      <div>
        <label>Password:</label>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <button type="submit" disabled={isLoading} style={{ padding: '8px', cursor: 'pointer' }}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}