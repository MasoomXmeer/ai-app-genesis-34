
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  Coins,
  DollarSign,
  Shield
} from 'lucide-react';

const PaymentGatewayConfig = () => {
  const [configurations, setConfigurations] = useState({
    stripe: { enabled: true, configured: true },
    twocheckout: { enabled: false, configured: false },
    paypal: { enabled: false, configured: false },
    binance: { enabled: false, configured: false },
    cryptomus: { enabled: false, configured: false }
  });

  const toggleGateway = (gateway: string) => {
    setConfigurations(prev => ({
      ...prev,
      [gateway]: {
        ...prev[gateway],
        enabled: !prev[gateway].enabled
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Payment Gateway Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Payment Gateway Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(configurations).map(([gateway, config]) => (
              <div key={gateway} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  {config.configured && config.enabled ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-gray-400" />
                  )}
                  <span className="ml-2 font-medium capitalize">{gateway}</span>
                </div>
                <Badge variant={config.enabled ? "default" : "secondary"}>
                  {config.enabled ? "Active" : "Inactive"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Gateway Configurations */}
      <Tabs defaultValue="stripe" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="stripe">Stripe</TabsTrigger>
          <TabsTrigger value="twocheckout">2Checkout</TabsTrigger>
          <TabsTrigger value="paypal">PayPal</TabsTrigger>
          <TabsTrigger value="binance">Binance Pay</TabsTrigger>
          <TabsTrigger value="cryptomus">Cryptomus</TabsTrigger>
        </TabsList>

        {/* Stripe Configuration */}
        <TabsContent value="stripe">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Stripe Configuration
                </div>
                <Button
                  variant={configurations.stripe.enabled ? "destructive" : "default"}
                  size="sm"
                  onClick={() => toggleGateway('stripe')}
                >
                  {configurations.stripe.enabled ? "Disable" : "Enable"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stripe-publishable">Publishable Key</Label>
                  <Input id="stripe-publishable" placeholder="pk_live_..." />
                </div>
                <div>
                  <Label htmlFor="stripe-secret">Secret Key</Label>
                  <Input id="stripe-secret" type="password" placeholder="sk_live_..." />
                </div>
                <div>
                  <Label htmlFor="stripe-webhook">Webhook Endpoint</Label>
                  <Input id="stripe-webhook" placeholder="whsec_..." />
                </div>
                <div>
                  <Label htmlFor="stripe-currency">Default Currency</Label>
                  <Input id="stripe-currency" placeholder="USD" defaultValue="USD" />
                </div>
              </div>
              <Button className="w-full">Update Stripe Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2Checkout Configuration */}
        <TabsContent value="twocheckout">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  2Checkout Configuration
                </div>
                <Button
                  variant={configurations.twocheckout.enabled ? "destructive" : "default"}
                  size="sm"
                  onClick={() => toggleGateway('twocheckout')}
                >
                  {configurations.twocheckout.enabled ? "Disable" : "Enable"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="2co-merchant">Merchant Code</Label>
                  <Input id="2co-merchant" placeholder="Enter merchant code" />
                </div>
                <div>
                  <Label htmlFor="2co-secret">Secret Key</Label>
                  <Input id="2co-secret" type="password" placeholder="Enter secret key" />
                </div>
                <div>
                  <Label htmlFor="2co-environment">Environment</Label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="sandbox">Sandbox</option>
                    <option value="production">Production</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="2co-currency">Default Currency</Label>
                  <Input id="2co-currency" placeholder="USD" defaultValue="USD" />
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <Shield className="h-4 w-4 inline mr-1" />
                  2Checkout supports 87+ countries and 15+ payment methods including credit cards, PayPal, and local payment options.
                </p>
              </div>
              <Button className="w-full">Update 2Checkout Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PayPal Configuration */}
        <TabsContent value="paypal">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  PayPal Configuration
                </div>
                <Button
                  variant={configurations.paypal.enabled ? "destructive" : "default"}
                  size="sm"
                  onClick={() => toggleGateway('paypal')}
                >
                  {configurations.paypal.enabled ? "Disable" : "Enable"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="paypal-client-id">Client ID</Label>
                  <Input id="paypal-client-id" placeholder="Enter PayPal Client ID" />
                </div>
                <div>
                  <Label htmlFor="paypal-client-secret">Client Secret</Label>
                  <Input id="paypal-client-secret" type="password" placeholder="Enter Client Secret" />
                </div>
                <div>
                  <Label htmlFor="paypal-environment">Environment</Label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="sandbox">Sandbox</option>
                    <option value="live">Live</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="paypal-webhook">Webhook ID</Label>
                  <Input id="paypal-webhook" placeholder="Enter Webhook ID" />
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <Shield className="h-4 w-4 inline mr-1" />
                  PayPal supports 200+ markets worldwide with multiple payment methods including PayPal balance, credit/debit cards, and local payment methods.
                </p>
              </div>
              <Button className="w-full">Update PayPal Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Binance Pay Configuration */}
        <TabsContent value="binance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Coins className="h-5 w-5 mr-2" />
                  Binance Pay Configuration
                </div>
                <Button
                  variant={configurations.binance.enabled ? "destructive" : "default"}
                  size="sm"
                  onClick={() => toggleGateway('binance')}
                >
                  {configurations.binance.enabled ? "Disable" : "Enable"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="binance-merchant-id">Merchant ID</Label>
                  <Input id="binance-merchant-id" placeholder="Enter Binance Merchant ID" />
                </div>
                <div>
                  <Label htmlFor="binance-api-key">API Key</Label>
                  <Input id="binance-api-key" placeholder="Enter API Key" />
                </div>
                <div>
                  <Label htmlFor="binance-secret-key">Secret Key</Label>
                  <Input id="binance-secret-key" type="password" placeholder="Enter Secret Key" />
                </div>
                <div>
                  <Label htmlFor="binance-environment">Environment</Label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="testnet">Testnet</option>
                    <option value="mainnet">Mainnet</option>
                  </select>
                </div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <Coins className="h-4 w-4 inline mr-1" />
                  Binance Pay supports cryptocurrency payments with BUSD, USDT, BTC, ETH, and other major cryptocurrencies. Zero transaction fees for merchants.
                </p>
              </div>
              <Button className="w-full">Update Binance Pay Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cryptomus Configuration */}
        <TabsContent value="cryptomus">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Coins className="h-5 w-5 mr-2" />
                  Cryptomus Configuration
                </div>
                <Button
                  variant={configurations.cryptomus.enabled ? "destructive" : "default"}
                  size="sm"
                  onClick={() => toggleGateway('cryptomus')}
                >
                  {configurations.cryptomus.enabled ? "Disable" : "Enable"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cryptomus-merchant-id">Merchant UUID</Label>
                  <Input id="cryptomus-merchant-id" placeholder="Enter Merchant UUID" />
                </div>
                <div>
                  <Label htmlFor="cryptomus-api-key">API Key</Label>
                  <Input id="cryptomus-api-key" placeholder="Enter API Key" />
                </div>
                <div>
                  <Label htmlFor="cryptomus-payment-key">Payment API Key</Label>
                  <Input id="cryptomus-payment-key" type="password" placeholder="Enter Payment API Key" />
                </div>
                <div>
                  <Label htmlFor="cryptomus-payout-key">Payout API Key</Label>
                  <Input id="cryptomus-payout-key" type="password" placeholder="Enter Payout API Key" />
                </div>
                <div>
                  <Label htmlFor="cryptomus-webhook">Webhook URL</Label>
                  <Input id="cryptomus-webhook" placeholder="https://yoursite.com/webhook/cryptomus" />
                </div>
                <div>
                  <Label htmlFor="cryptomus-network">Default Network</Label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="tron">TRON (TRX)</option>
                    <option value="ethereum">Ethereum (ETH)</option>
                    <option value="bitcoin">Bitcoin (BTC)</option>
                    <option value="bsc">Binance Smart Chain (BSC)</option>
                  </select>
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-800">
                  <Coins className="h-4 w-4 inline mr-1" />
                  Cryptomus supports 100+ cryptocurrencies across multiple networks including TRON, Ethereum, Bitcoin, and BSC with competitive rates.
                </p>
              </div>
              <Button className="w-full">Update Cryptomus Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentGatewayConfig;
