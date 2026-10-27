import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Med-Sathi Runtime Error]', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    try {
      localStorage.clear();
    } catch (e) {}
    window.location.href = '/login';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#121616] text-[#dcedff] flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-[#181d1e] border border-rose-500/40 rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h1 className="text-xl font-bold font-mono uppercase text-white">
              Application Runtime Notice
            </h1>

            <p className="text-xs text-[#8f91a2] leading-relaxed">
              Med-Sathi encountered a display initialization issue. Click below to reset local session cache and open the evaluator station.
            </p>

            {this.state.error && (
              <div className="p-3 rounded-lg bg-black/50 border border-rose-900/50 text-[11px] font-mono text-rose-300 overflow-x-auto max-h-36">
                {this.state.error.toString()}
              </div>
            )}

            <div className="pt-2 flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 py-2.5 rounded-xl bg-[#94b0da] text-[#121616] font-bold text-xs uppercase tracking-wider hover:opacity-90 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Cache & Open Demo</span>
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

