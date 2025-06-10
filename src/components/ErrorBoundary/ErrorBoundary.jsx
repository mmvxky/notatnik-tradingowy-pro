import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Aktualizuj stan, aby następny render pokazał UI zastępcze.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Możesz także zalogować błąd do serwisu raportowania błędów
    console.error("Nieprzechwycony błąd w komponencie:", error, errorInfo);
    this.setState({ error: error, errorInfo: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Renderowanie UI zastępczego
      return (
        <div style={{ padding: '20px', color: '#ff4d4d' }}>
          <h2>Wystąpił krytyczny błąd aplikacji.</h2>
          <p>Zamiast czarnego ekranu, widzisz ten komunikat. Skopiuj poniższą treść i przekaż ją dalej w celu naprawy błędu.</p>
          <details style={{ whiteSpace: 'pre-wrap', background: '#333', padding: '10px', borderRadius: '8px' }}>
            <summary>Szczegóły techniczne błędu</summary>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;