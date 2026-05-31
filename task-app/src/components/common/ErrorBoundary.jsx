import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Application error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="app-error-boundary">
          <div className="card app-error-card">
            <p className="page-eyebrow">Something went wrong</p>
            <h1 className="page-title">The app could not load this view.</h1>
            <p className="page-subtitle">Please refresh the page or sign in again.</p>
            <button className="btn btn-primary" onClick={() => window.location.assign("/login")}>
              Back to Login
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
