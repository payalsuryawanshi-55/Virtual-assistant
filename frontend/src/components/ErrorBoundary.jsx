import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false,
      errorMessage: ''
    }
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true,
      errorMessage: error.message 
    }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-[#020253] to-black flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-center border border-white/20">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-white text-2xl font-bold mb-2">
              Something Went Wrong
            </h1>
            <p className="text-gray-300 text-sm mb-6">
              {this.state.errorMessage || 'An unexpected error occurred'}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition font-medium"
              >
                🔄 Refresh Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="px-5 py-2 bg-gray-500/50 hover:bg-gray-600/50 text-white rounded-lg transition font-medium"
              >
                🏠 Go Home
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-6">
              If the problem persists, please clear your browser cache or contact support
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary