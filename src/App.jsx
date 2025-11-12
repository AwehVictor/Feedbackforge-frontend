import { Routes, Route } from "react-router-dom"
import { CustomerDashboard } from "./pages/CustomerDashboard"
import { AdminDashboard } from "./pages/AdminDashboard"
import { LoginForm } from "./components/LoginForm"
import { SignupForm } from "./components/SignupForm"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { AuthProvider } from "./context/AuthContext"
import { Toaster } from "sonner"

function App() {
    return (
      <AuthProvider>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/" element={<CustomerDashboard />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    );
}

export default App;
