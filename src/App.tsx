import './App.css'
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { APIKeyProvider } from '@/lib/APIKeyContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey as keyof typeof Pages] : () => <></>;

// Define which pages require authentication
const protectedPages = ['MyAPIs', 'MyKeys', 'Analytics', 'Profile'];

interface LayoutWrapperProps {
  children: React.ReactNode;
  currentPageName?: string;
}

const LayoutWrapper = ({ children, currentPageName }: LayoutWrapperProps) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const AuthenticatedApp = () => {
  const { isLoadingAuth } = useAuth();

  // Show loading spinner while checking auth
  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />

      {/* API detail route with name parameter */}
      <Route
        path="/api/:apiName"
        element={
          <LayoutWrapper currentPageName="APIDetail">
            <Pages.APIDetail />
          </LayoutWrapper>
        }
      />

      {Object.entries(Pages).map(([path, Page]) => {
        const isProtected = protectedPages.includes(path);

        return (
          <Route
            key={path}
            path={`/${path}`}
            element={
              <LayoutWrapper currentPageName={path}>
                {isProtected ? (
                  <ProtectedRoute>
                    <Page />
                  </ProtectedRoute>
                ) : (
                  <Page />
                )}
              </LayoutWrapper>
            }
          />
        );
      })}
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <APIKeyProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </APIKeyProvider>
    </AuthProvider>
  )
}

export default App
