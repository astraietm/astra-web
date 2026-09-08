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
        <div className="min-h-screen bg-[#08090D] flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-[#0F1117] border border-white/[0.08] rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-7 h-7" />
            </div>
            
            <h1 className="text-xl font-bold text-white mb-2">
              Unable to load this page
            </h1>
            
            <p className="text-slate-400 mb-6 text-sm">
              Something went wrong while loading the workspace.
            </p>

            {this.state.error && (
              <div className="bg-black/40 border border-white/[0.06] rounded-xl p-4 mb-6 text-left overflow-hidden">
                <p className="text-[11px] font-semibold text-slate-400 mb-1">Error details:</p>
                <p className="text-xs font-mono text-rose-300 break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
