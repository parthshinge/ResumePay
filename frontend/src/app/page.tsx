'use client';

import { useState } from 'react';
import { Upload, FileText, Shield, Zap, Lock } from 'lucide-react';
import ResumeUpload from '@/components/ResumeUpload';
import PaymentFlow from '@/components/PaymentFlow';
import ReviewResults from '@/components/ReviewResults';

type Step = 'upload' | 'payment' | 'review';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [resumeData, setResumeData] = useState<any>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [reviewData, setReviewData] = useState<any>(null);

  const handleUploadComplete = (data: any) => {
    setResumeData(data.resume);
    setPaymentData(data.payment);
    setCurrentStep('payment');
  };

  const handlePaymentComplete = (data: any) => {
    setPaymentData(data);
    setCurrentStep('review');
  };

  const handleReviewComplete = (data: any) => {
    setReviewData(data);
  };

  const resetFlow = () => {
    setCurrentStep('upload');
    setResumeData(null);
    setPaymentData(null);
    setReviewData(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-600 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">ResumePay AI</h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Shield className="h-4 w-4" />
              <span>Powered by b402 on Base</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center space-x-8 mb-8">
          <StepIndicator
            step={1}
            label="Upload"
            active={currentStep === 'upload'}
            completed={currentStep !== 'upload'}
            icon={<Upload className="h-5 w-5" />}
          />
          <div className="h-0.5 w-16 bg-gray-300" />
          <StepIndicator
            step={2}
            label="Payment"
            active={currentStep === 'payment'}
            completed={currentStep === 'review'}
            icon={<Zap className="h-5 w-5" />}
          />
          <div className="h-0.5 w-16 bg-gray-300" />
          <StepIndicator
            step={3}
            label="Review"
            active={currentStep === 'review'}
            completed={false}
            icon={<FileText className="h-5 w-5" />}
          />
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === 'upload' && (
            <ResumeUpload onComplete={handleUploadComplete} />
          )}
          {currentStep === 'payment' && (
            <PaymentFlow
              paymentData={paymentData}
              resumeData={resumeData}
              onComplete={handlePaymentComplete}
              onBack={() => setCurrentStep('upload')}
            />
          )}
          {currentStep === 'review' && (
            <ReviewResults
              resumeData={resumeData}
              paymentData={paymentData}
              onComplete={handleReviewComplete}
              onReset={resetFlow}
            />
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Lock className="h-8 w-8 text-primary-600" />}
            title="Privacy First"
            description="Your resume is processed securely with encrypted storage and automatic deletion"
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8 text-primary-600" />}
            title="Instant Results"
            description="Get AI-powered resume analysis in seconds, not hours or days"
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8 text-primary-600" />}
            title="Pay Per Use"
            description="No subscriptions. Pay only when you need a review with USDC on Base"
          />
        </div>
      </div>
    </main>
  );
}

function StepIndicator({
  step,
  label,
  active,
  completed,
  icon,
}: {
  step: number;
  label: string;
  active: boolean;
  completed: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center space-x-2">
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
          active
            ? 'border-primary-600 bg-primary-600 text-white'
            : completed
            ? 'border-green-500 bg-green-500 text-white'
            : 'border-gray-300 bg-white text-gray-400'
        }`}
      >
        {completed ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          icon
        )}
      </div>
      <span
        className={`text-sm font-medium ${
          active ? 'text-primary-600' : completed ? 'text-green-600' : 'text-gray-400'
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
