import React, { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Check for chunk loading errors
    const errorString = error?.toString() || '';
    if (errorString.includes('Failed to fetch dynamically imported module') || 
        errorString.toLowerCase().includes('loading chunk')) {
      console.log('Dynamic import failure detected. Auto-reloading...');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }

    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#05080f] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gradient-to-br from-[#0F141F] to-[#0A0F1C] border border-red-500/30 rounded-lg p-8 text-center">
            {/* Corner Accents */}
            <div className="relative">
              <div className="absolute -top-12 -left-12 w-8 h-8 border-t-2 border-l-2 border-red-500/50" />
              <div className="absolute -top-12 -right-12 w-8 h-8 border-t-2 border-r-2 border-red-500/50" />
              <div className="absolute -bottom-12 -left-12 w-8 h-8 border-b-2 border-l-2 border-red-500/50" />
              <div className="absolute -bottom-12 -right-12 w-8 h-8 border-b-2 border-r-2 border-red-500/50" />
              
              <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              
              <h1 className="text-2xl font-bold text-white mb-2 font-mono uppercase">
                [SYSTEM_ERROR]
              </h1>
              
              <p className="text-gray-400 mb-6 font-mono text-sm">
                <span className="text-red-400">&gt;</span> Critical failure detected in application runtime
              </p>

              {this.state.error && (
                <div className="bg-black/30 border border-red-500/20 rounded p-4 mb-6 text-left">
                  <p className="text-xs font-mono text-red-400 mb-2">ERROR_LOG:</p>
                  <p className="text-xs font-mono text-gray-500 break-all">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}

              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded font-mono text-sm uppercase tracking-wider hover:bg-red-500/30 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                [REBOOT_SYSTEM]
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
