import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import DirectoryPage from './pages/DirectoryPage'
import CompanyProfilePage from './pages/CompanyProfilePage'
import RegisterPage from './pages/RegisterPage'
import PlansPage from './pages/PlansPage'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import QuotesPage from './pages/QuotesPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/plans" element={<PlansPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/directory" element={<ProtectedRoute><DirectoryPage /></ProtectedRoute>} />
              <Route path="/company/:slug" element={<ProtectedRoute><CompanyProfilePage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/quotes" element={<ProtectedRoute><QuotesPage /></ProtectedRoute>} />
              <Route path="/payment-success" element={<PaymentSuccessPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
