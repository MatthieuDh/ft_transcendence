import './index.css'
import App from './App.tsx'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from './components/ui/provider' 
import { AuthProvider } from './context/AuthContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>
  </React.StrictMode>
)