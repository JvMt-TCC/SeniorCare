import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeStorage } from './lib/storage'

// Inicializar storage antes de renderizar o app
initializeStorage().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
}).catch(() => {
  // Em caso de erro, renderiza mesmo assim
  createRoot(document.getElementById("root")!).render(<App />);
});