import './index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'sonner'

import { App } from './app'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster richColors />
  </React.StrictMode>,
)
