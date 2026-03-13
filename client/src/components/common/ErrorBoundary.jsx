import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application render error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-center">
          <div className="max-w-lg rounded-[32px] border border-white/10 bg-white/5 p-10">
            <h1 className="text-3xl font-semibold text-white">Something broke.</h1>
            <p className="mt-4 text-slate-300">
              The page hit an unexpected error. Refresh to try again.
            </p>
            {import.meta.env.DEV && this.state.error ? (
              <pre className="mt-4 overflow-auto rounded-2xl bg-slate-950 p-4 text-left text-xs text-rose-300">
                {this.state.error.message}
              </pre>
            ) : null}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
