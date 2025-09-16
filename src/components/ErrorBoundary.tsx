import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-[#0FA0CE] via-[#222222] to-[#1EAEDB] flex items-center justify-center p-4">
          <Card className="glass-card border-white/20 max-w-md w-full">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="h-16 w-16 text-yellow-400" />
              </div>
              <CardTitle className="text-white text-2xl">Oops! Something went wrong</CardTitle>
              <CardDescription className="text-white/70">
                We're sorry, but something unexpected happened. Don't worry - your music and data are safe!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={this.handleRetry}
                  className="bg-gradient-to-r from-[#1EAEDB] to-[#0FA0CE] text-white w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                
                <Button 
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 w-full"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go to Home
                </Button>
                
                <Button 
                  onClick={this.handleReload}
                  variant="ghost"
                  className="text-white/70 hover:text-white hover:bg-white/10 w-full"
                >
                  Reload Page
                </Button>
              </div>
              
              {/* Error details for development */}
              {import.meta.env.MODE === 'development' && this.state.error && (
                <details className="mt-6">
                  <summary className="text-white/70 text-sm cursor-pointer hover:text-white">
                    Error Details (Development)
                  </summary>
                  <div className="mt-2 p-3 bg-black/30 rounded text-xs text-white/60 font-mono overflow-auto max-h-40">
                    <p className="text-red-400 mb-2">{this.state.error.name}: {this.state.error.message}</p>
                    <pre className="whitespace-pre-wrap">
                      {this.state.error.stack}
                    </pre>
                    {this.state.errorInfo && (
                      <div className="mt-2 pt-2 border-t border-white/10">
                        <p className="text-yellow-400 mb-1">Component Stack:</p>
                        <pre className="whitespace-pre-wrap">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
              
              <div className="text-center pt-4 border-t border-white/10">
                <p className="text-white/60 text-xs">
                  If this problem persists, please contact support with the error details above.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;