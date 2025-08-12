"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({ error, errorInfo });
    
    // Log to external service in production
    if (process.env.NODE_ENV === "production") {
      // TODO: Add error logging service
      console.error("Production error:", { error, errorInfo });
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-blue-50"
        >
          <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-red-100">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-6xl mb-4"
              >
                ⚠️
              </motion.div>
              
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                משהו השתבש
              </h2>
              
              <p className="text-gray-600 mb-6">
                אירעה שגיאה לא צפויה. אנא נסה לרענן את הדף או לחזור מאוחר יותר.
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full py-3 px-6 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  רענן דף
                </button>
                
                <button
                  onClick={() => this.setState({ hasError: false })}
                  className="w-full py-3 px-6 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  נסה שוב
                </button>
              </div>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                    פרטי שגיאה (פיתוח בלבד)
                  </summary>
                  <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const handleError = React.useCallback((error: Error) => {
    console.error("Error caught by hook:", error);
    setError(error);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
}
