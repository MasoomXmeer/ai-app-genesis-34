
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: "How does AI Builder Pro work?",
    answer: "AI Builder Pro uses advanced AI models to understand your requirements in natural language and generates fully functional code. Simply describe what you want to build, and our AI will create the application structure, components, and logic."
  },
  {
    question: "What types of applications can I build?",
    answer: "You can build web applications, mobile apps, WordPress plugins, and more. Our platform supports React, Vue, React Native, and various other frameworks to meet your development needs."
  },
  {
    question: "Do I need coding experience?",
    answer: "While coding experience is helpful, it's not required. AI Builder Pro is designed to be accessible to both technical and non-technical users. The AI guides you through the development process step by step."
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! We offer a free trial that includes access to basic features and limited AI generations. You can upgrade to a paid plan anytime to unlock premium features and unlimited usage."
  },
  {
    question: "How secure is my code and data?",
    answer: "Security is our top priority. All code and data are encrypted in transit and at rest. We follow industry-standard security practices and compliance requirements to protect your intellectual property."
  },
  {
    question: "Can I export my code?",
    answer: "Absolutely! You own all the code generated by AI Builder Pro. You can export your projects at any time and deploy them on your preferred hosting platform."
  }
];

export const FAQ = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about AI Builder Pro
          </p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-gray-100 rounded-lg px-6 py-2 bg-gray-50/50 hover:bg-gray-50 transition-colors"
              >
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed pt-2 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
