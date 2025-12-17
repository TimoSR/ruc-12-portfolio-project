import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/main.css'
import App from './App'

import { RootStoreContext, rootStore } from './store/RootStore'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootStoreContext.Provider value={rootStore}>
      <App />
    </RootStoreContext.Provider>
  </StrictMode>,
)