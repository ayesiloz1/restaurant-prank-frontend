import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '100vh',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h2>⚠️ Something went wrong</h2>
          <p>The application encountered an error.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Reload Page
          </button>
          <details style={{ marginTop: '20px', maxWidth: '600px' }}>
            <summary>Error details</summary>
            <pre style={{ 
              background: 'rgba(0,0,0,0.3)', 
              padding: '10px', 
              borderRadius: '4px',
              fontSize: '0.8rem',
              textAlign: 'left',
              marginTop: '10px'
            }}>
              {this.state.error?.toString()}
            </pre>
          </details>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
