import { Router, Route } from 'preact-router'
import { useState } from 'preact/hooks'
import { Dashboard } from './pages/Dashboard'
import { Applications } from './pages/Applications'
import { Payments } from './pages/Payments'
import { Subscriptions } from './pages/Subscriptions'
import { Sidebar } from './components/layout/sidebar'
import { Header } from './components/layout/header'
import { AuthProvider } from './contexts/auth-context'
import { ProtectedRoute } from './components/auth/protected-route'

function AppContent() {
  const [currentPath, setCurrentPath] = useState('/')

  const handleRoute = (e: any) => {
    setCurrentPath(e.url)
  }

  return (
    <div class="min-h-screen bg-plaxo-background flex">
      <Sidebar currentPath={currentPath} />
      <div class="flex-1 flex flex-col">
        <Header />
        <main class="flex-1 overflow-auto">
          <Router onChange={handleRoute}>
            <Route path="/" component={Dashboard} />
            <Route path="/applications" component={Applications} />
            <Route path="/payments" component={Payments} />
            <Route path="/subscriptions" component={Subscriptions} />
          </Router>
        </main>
      </div>
    </div>
  )
}

export function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AppContent />
      </ProtectedRoute>
    </AuthProvider>
  )
}