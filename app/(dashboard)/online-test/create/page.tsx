'use client';

import { useState } from 'react';
import StepperBar from '@/components/online-test/StepperBar';
import BasicInfoForm, { BasicInfo } from '@/components/online-test/BasicInfoForm';
import BasicInfoView from '@/components/online-test/BasicInfoView';
import QuestionsStep from '@/components/online-test/QuestionsStep';

type Step = 'form' | 'view' | 'questions';

export default function CreateOnlineTestPage() {
  const [step, setStep] = useState<Step>('form');
  const [savedData, setSavedData] = useState<BasicInfo | null>(null);

  const currentStep = step === 'form' || step === 'view' ? 1 : 2;

  return (
    <div className="flex flex-col gap-6">
      <StepperBar currentStep={currentStep} />

      {step === 'form' && (
        <BasicInfoForm
          onSave={(data) => {
            setSavedData(data);
            setStep('view');
          }}
        />
      )}

      {step === 'view' && savedData && (
        <BasicInfoView
          data={savedData}
          onEdit={() => setStep('form')}
          onContinue={() => setStep('questions')}
        />
      )}

      {step === 'questions' && <QuestionsStep testData={savedData} />}
    </div>
  );
}
