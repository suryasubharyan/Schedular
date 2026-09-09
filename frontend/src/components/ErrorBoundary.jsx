import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Unhandled UI error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white text-center dark:bg-neutral-950">
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Something went wrong.
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Please refresh the page. If this keeps happening, contact support.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
          >
            Refresh
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
