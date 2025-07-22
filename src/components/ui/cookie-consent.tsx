import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Cookie } from 'lucide-react';

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowConsent(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card className="border shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Cookie className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-2">Cookie Consent</h3>
              <p className="text-xs text-muted-foreground mb-3">
                We use cookies to enhance your experience and analyze site usage. 
                By continuing, you agree to our cookie policy.
              </p>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  onClick={handleAccept}
                  className="text-xs"
                >
                  Accept
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleDecline}
                  className="text-xs"
                >
                  Decline
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowConsent(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}