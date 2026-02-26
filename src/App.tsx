import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './router/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { EnrollmentPage } from './pages/EnrollmentPage';
import { UsersPage } from './pages/UsersPage';
import { ClaimsPage } from './pages/ClaimsPage';
import { ReportsPage } from './pages/ReportsPage';
import { ProfilePage } from './pages/ProfilePage';
import { ConfigPage } from './pages/ConfigPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 1000 * 60 * 5, // Auto-actualizar cada 5 minutos
      refetchOnWindowFocus: true,     // Refrescar al volver a la pestaña
      retry: 2,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/x82b9" element={<LoginPage />} />
            <Route
              path="/4a12b69c3dcb/000c66e873233b66"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <EnrollmentPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/4a12b69c3dcb/f7e8d9c0b1a2"
              element={
                <ProtectedRoute allowedRoles={['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_AUDITOR']}>
                  <MainLayout>
                    <ClaimsPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/4a12b69c3dcb/d3e4f5a6b7c8"
              element={
                <ProtectedRoute allowedRoles={['ROLE_SUPER_ADMIN', 'ROLE_ADMIN']}>
                  <MainLayout>
                    <UsersPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/4a12b69c3dcb/a3b2c1d0e9f8"
              element={
                <ProtectedRoute allowedRoles={['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_AUDITOR']}>
                  <MainLayout>
                    <ReportsPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/4a12b69c3dcb/c0nfig"
              element={
                <ProtectedRoute allowedRoles={['ROLE_SUPER_ADMIN']} allowedUsernames={['falenda']}>
                  <MainLayout>
                    <ConfigPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ProfilePage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* --- MANEJO DE ERRORES Y REDIRECCIONES --- */}

            <Route path="/unauthorized" element={
              <div className="flex h-screen flex-col items-center justify-center bg-slate-50">
                <h1 className="text-4xl font-bold text-slate-900">403</h1>
                <p className="text-slate-500">No tienes permisos para acceder aquí.</p>
                <button
                  onClick={() => window.location.href = '/'}
                  className="mt-4 text-[#ff8200] font-semibold underline"
                >
                  Volver al inicio
                </button>
              </div>
            } />

            {/* Si un usuario logueado intenta ir a una ruta que no existe, lo mandamos a inscripciones */}
            {/* Si no está logueado, el ProtectedRoute lo mandará al Login o la Landing */}
            <Route path="*" element={<Navigate to="/4a12b69c3dcb/000c66e873233b66" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;