import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = React.useState('Processing authorization...');

  useEffect(() => {
    const processCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          setStatus('error');
          setMessage(errorDescription || 'Authorization failed');
          return;
        }

        if (!code) {
          setStatus('error');
          setMessage('No authorization code received');
          return;
        }

        // Determine provider from URL path
        const path = window.location.pathname;
        const provider = path.includes('vercel') ? 'vercel' : 'netlify';

        // In a real implementation, you'd exchange the code for an access token
        // For this demo, we'll simulate the token exchange
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate storing the token
        localStorage.setItem(`${provider}_auth_token`, `token_${Date.now()}_${Math.random()}`);
        localStorage.setItem(`${provider}_auth_expires`, String(Date.now() + 3600000)); // 1 hour

        setStatus('success');
        setMessage(`Successfully authorized with ${provider === 'vercel' ? 'Vercel' : 'Netlify'}!`);

        // Close the popup window
        setTimeout(() => {
          window.close();
        }, 2000);

      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage('Failed to process authorization');
      }
    };

    processCallback();
  }, [searchParams]);

  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-8 w-8 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'error':
        return <XCircle className="h-8 w-8 text-red-500" />;
    }
  };

  const getTitle = () => {
    switch (status) {
      case 'loading':
        return 'Authorizing...';
      case 'success':
        return 'Authorization Successful';
      case 'error':
        return 'Authorization Failed';
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center space-y-4 p-8">
          {getIcon()}
          <h1 className="text-xl font-semibold text-center">{getTitle()}</h1>
          <p className="text-sm text-muted-foreground text-center">{message}</p>
          {status === 'success' && (
            <p className="text-xs text-muted-foreground text-center">
              This window will close automatically...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthCallback;