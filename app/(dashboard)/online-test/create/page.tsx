'use client';

import { useState } from 'react';
import StepperBar from '@/components/online-test/StepperBar';
import BasicInfoForm from '@/components/online-test/BasicInfoForm';
import BasicInfoView from '@/components/online-test/BasicInfoView';
import QuestionsStep from '@/components/online-test/QuestionsStep';

type Step = 'form' | 'view' | 'questions';

export default function CreateOnlineTestPage() {
  const [step, setStep] = useState<Step>('form');
  const currentStep = step === 'questions' ? 2 : 1;

  return (
    <div className="flex flex-col gap-6">
      <StepperBar currentStep={currentStep} />
      {step === 'form' && <BasicInfoForm onSave={() => setStep('view')} />}
      {step === 'view' && <BasicInfoView onEdit={() => setStep('form')} onContinue={() => setStep('questions')} />}
      {step === 'questions' && <QuestionsStep />}
    </div>
  );
}
