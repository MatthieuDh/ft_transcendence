import './index.css'
import App from './App.tsx'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from './components/ui/provider' 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider>  
      <App />
    </Provider>
  </React.StrictMode>
)