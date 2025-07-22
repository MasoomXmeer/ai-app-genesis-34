import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                By accessing and using AI Builder Pro, you accept and agree to be bound by the 
                terms and provision of this agreement.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Use License</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Permission is granted to temporarily use AI Builder Pro for personal, 
                non-commercial transitory viewing only.
              </p>
              <div>
                <h3 className="font-semibold mb-2">This license shall not allow you to:</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Modify or copy the materials</li>
                  <li>• Use the materials for commercial purposes</li>
                  <li>• Attempt to reverse engineer any software</li>
                  <li>• Remove any copyright or proprietary notations</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We strive to provide continuous service availability but do not guarantee 
                uninterrupted access. We reserve the right to modify or discontinue the 
                service at any time.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                In no event shall AI Builder Pro or its suppliers be liable for any damages 
                arising out of the use or inability to use the service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                If you have any questions about these Terms of Service, please contact us at{' '}
                <a href="mailto:legal@aibuilder.pro" className="text-primary hover:underline">
                  legal@aibuilder.pro
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Terms;