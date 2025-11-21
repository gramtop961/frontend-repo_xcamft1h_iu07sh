import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom'
import './index.css'
import './styles/theme.css'
import Home from './pages/Home'
import Clock from './pages/Clock'
import Admin from './pages/Admin'
import ClosingStep1 from './pages/ClosingStep1'
import ClosingStep2 from './pages/ClosingStep2'
import ClosingStep3 from './pages/ClosingStep3'
import ClosingSummary from './pages/ClosingSummary'
import { KEYS } from './utils/storage'

function RoutePersistence() {
  const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    const saved = localStorage.getItem(KEYS.lastRoute)
    if (saved && saved !== location.pathname) {
      navigate(saved, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    localStorage.setItem(KEYS.lastRoute, location.pathname)
  }, [location.pathname])
  return null
}

function AppRouter() {
  return (
    <>
      <RoutePersistence />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clock" element={<Clock />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/closing/step-1" element={<ClosingStep1 />} />
        <Route path="/closing/step-2" element={<ClosingStep2 />} />
        <Route path="/closing/step-3" element={<ClosingStep3 />} />
        <Route path="/closing/summary" element={<ClosingSummary />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </React.StrictMode>,
)
