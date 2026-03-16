import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import HabitDetails from './pages/HabitDetails';
import Analytics from './pages/Analytics';
import AIInsights from './pages/AIInsights';
import FocusMode from './pages/FocusMode';
import Journal from './pages/Journal';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Error boundary to prevent white-screen crashes
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: string }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: '' };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-8 text-center">
          <div className="max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-slate-800 mb-3">Something went wrong</h1>
            <p className="text-slate-500 mb-2 text-sm font-mono bg-slate-100 p-3 rounded-lg">{this.state.error}</p>
            <p className="text-slate-400 text-sm mb-6">This might be a connection issue with the backend.</p>
            <button
              onClick={() => { this.setState({ hasError: false, error: '' }); window.location.href = '/'; }}
              className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// simple guard
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<ProtectedRoute><ErrorBoundary><Layout /></ErrorBoundary></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="habit/:id" element={<HabitDetails />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="ai-insights" element={<AIInsights />} />
          <Route path="journal" element={<Journal />} />
        </Route>
        <Route path="/focus" element={<ProtectedRoute><FocusMode /></ProtectedRoute>} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
