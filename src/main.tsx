import React from 'react'
import ReactDOM from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import App from './App'
import './index.css'

// reducedMotion="user": las animaciones de motion/react (ej. el spring del
// pill del sidebar) respetan prefers-reduced-motion.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </React.StrictMode>,
)
