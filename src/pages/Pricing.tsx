
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Zap, Crown, Rocket, X } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "Free",
      description: "Perfect for getting started",
      icon: <Zap className="h-6 w-6" />,
      features: [
        "100 AI messages/month",
        "3 projects",
        "Basic AI models (GPT-3.5)",
        "Platform API keys only",
        "Community support",
        "Web app deployment",
        "Basic templates"
      ],
      restrictions: [
        "No custom API keys",
        "Limited AI model access",
        "Basic optimization only"
      ],
      buttonText: "Get Started",
      popular: false,
      apiAccess: false
    },
    {
      name: "Pro",
      price: "$29",
      description: "Best for professionals",
      icon: <Crown className="h-6 w-6" />,
      features: [
        "1,000 AI messages/month",
        "Unlimited projects",
        "Advanced AI models (GPT-4, Claude)",
        "Platform API keys only",
        "Priority support",
        "All deployment options",
        "Custom domains",
        "Team collaboration",
        "Premium templates",
        "Advanced optimization"
      ],
      restrictions: [
        "No custom API keys",
        "Platform rate limits apply"
      ],
      buttonText: "Start Free Trial",
      popular: true,
      apiAccess: false
    },
    {
      name: "Enterprise",
      price: "$99",
      description: "For large teams and companies",
      icon: <Rocket className="h-6 w-6" />,
      features: [
        "10,000 AI messages/month",
        "Unlimited everything",
        "All AI models available",
        "✨ Custom API keys support",
        "Bring your own OpenAI/Anthropic keys",
        "No platform rate limits",
        "Dedicated support",
        "White-label solution",
        "Advanced analytics",
        "SSO integration",
        "Custom AI training",
        "Priority generation queue"
      ],
      restrictions: [],
      buttonText: "Contact Sales",
      popular: false,
      apiAccess: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Start building for free, then add a plan to go live. Custom API keys available in Enterprise only.
          </p>
          
          {/* API Key Notice */}
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 rounded-lg p-4 max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-2">
              <Rocket className="h-5 w-5 text-purple-600 mr-2" />
              <span className="font-semibold text-purple-800">Custom API Keys</span>
            </div>
            <p className="text-sm text-purple-700">
              Only Enterprise plan users can configure their own OpenAI, Anthropic, Google AI, or Groq API keys. 
              Free and Pro plans use our platform APIs with built-in rate limits.
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-blue-600 scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                    : plan.apiAccess
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-4xl font-bold text-gray-900">
                  {plan.price}
                  {plan.price !== "Free" && <span className="text-lg text-gray-600">/month</span>}
                </div>
                <p className="text-gray-600">{plan.description}</p>
                
                {/* API Access Badge */}
                {plan.apiAccess && (
                  <div className="mt-2">
                    <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      ✨ Custom API Keys Enabled
                    </span>
                  </div>
                )}
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className={`text-gray-700 ${feature.includes('✨') ? 'font-medium text-purple-700' : ''}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Restrictions */}
                {plan.restrictions.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Restrictions:</h4>
                    <ul className="space-y-1">
                      {plan.restrictions.map((restriction, restrictionIndex) => (
                        <li key={restrictionIndex} className="flex items-start">
                          <X className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-500">{restriction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                      : plan.apiAccess
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-5xl mx-auto">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I use my own API keys?</h3>
                <p className="text-gray-600">Only Enterprise plan users can configure their own OpenAI, Anthropic, Google AI, or Groq API keys. This allows you to have direct control over costs and rate limits.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What are AI messages?</h3>
                <p className="text-gray-600">AI messages are interactions with our AI models to generate code, designs, and content for your projects. Each plan includes a monthly limit.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I change plans anytime?</h3>
                <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What AI models are available?</h3>
                <p className="text-gray-600">Free: GPT-3.5. Pro: GPT-4, Claude 3. Enterprise: All models plus your own API keys for any provider.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
                <p className="text-gray-600">Yes, Pro and Enterprise plans come with a 14-day free trial. No credit card required.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h3>
                <p className="text-gray-600">Yes, we offer a 30-day money-back guarantee for all paid plans.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
