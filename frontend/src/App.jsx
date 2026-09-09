import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import SocialDataInitializer from "./store/SocialDataInitializer";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import NotificationContainer from "./components/NotificationContainer";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

const Auth = lazy(() => import("./pages/Auth"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Landing = lazy(() => import("./pages/Landing"));
const Platforms = lazy(() => import("./pages/Platforms"));
const Settings = lazy(() => import("./pages/Settings"));

function App() {
  return (
    <ErrorBoundary>
       <Provider store={store}>
      <NotificationProvider>
        <AuthProvider>
          <ThemeProvider>
            <SocialDataInitializer />
              <BrowserRouter>
                <NotificationContainer />
                <Suspense
                  fallback={
                    <div className="p-6 text-center text-sm text-neutral-400">
                      Loading…
                    </div>
                  }
                >
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Auth />} />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/analytics"
                      element={
                        <ProtectedRoute>
                          <Analytics />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/calendar"
                      element={
                        <ProtectedRoute>
                          <Calendar />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/platforms"
                      element={
                        <ProtectedRoute>
                          <Platforms />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </Suspense>
              </BrowserRouter>
           
          </ThemeProvider>
        </AuthProvider>
      </NotificationProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
