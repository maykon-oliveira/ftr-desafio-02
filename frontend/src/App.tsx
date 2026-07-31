import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import { Login } from './pages/Login'
import { useAuthStore } from './store/auth'
import { SignUp } from './pages/SignUp'
import { Dashboard } from './pages/Dashboard'
import { Transaction } from './pages/Transaction'
import { Category } from './pages/Category'
import { Profile } from './pages/Profile'
import { DashboardLayout } from './components/DashboardLayout'
import { Toaster } from './components/ui/sonner'

function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  ) : (
    <Navigate to="/login" replace />
  )
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />
}

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transaction />} />
            <Route path="/categories" element={<Category />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </main>
      <Toaster />
    </div>
  )
}

export default App
