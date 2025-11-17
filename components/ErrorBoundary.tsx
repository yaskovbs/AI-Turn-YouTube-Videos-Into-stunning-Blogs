import React from 'react';

// Fix: Define interfaces for ErrorBoundary's props and state
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

// Fix: Add generic type arguments to React.Component
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error in ErrorBoundary:", error, errorInfo);
    // Fix: Access setState from `this`
    this.setState({ errorInfo });
  }

  render() {
    // Fix: Access state and props properties directly from this.state and this.props
    if (this.state.hasError) {
      return React.createElement(
        'div',
        { className: 'flex flex-col items-center justify-center p-8 bg-red-900 text-white rounded-lg shadow-lg m-8' },
        React.createElement('h2', { className: 'text-2xl font-bold mb-4' }, 'Oops! Something went wrong.'),
        React.createElement('p', { className: 'text-lg mb-4' }, 'We are sorry for the inconvenience. Please try refreshing the page.'),
        this.state.error && React.createElement(
          'details',
          { className: 'text-sm text-red-200 mt-4' },
          React.createElement('summary', null, 'Error Details'),
          React.createElement('pre', { className: 'mt-2 p-2 bg-red-800 rounded overflow-auto max-h-60' }, this.state.error.toString()),
          this.state.errorInfo && React.createElement('pre', { className: 'mt-2 p-2 bg-red-800 rounded overflow-auto max-h-60' }, this.state.errorInfo.componentStack)
        )
      );
    }

    // Fix: Access children from `this.props`
    return this.props.children;
  }
}

export default ErrorBoundary;
