import { Check } from 'lucide-react'

function StepIndicator({ steps, currentStep }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center">
            <div 
              className={`step-indicator ${
                index < currentStep 
                  ? 'step-completed' 
                  : index === currentStep 
                    ? 'step-active' 
                    : 'step-pending'
              }`}
            >
              {index < currentStep ? <Check size={20} /> : index + 1}
            </div>
            <span className={`text-xs mt-2 ${
              index <= currentStep ? 'text-arl-blue font-medium' : 'text-gray-400'
            }`}>
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div 
              className={`w-16 h-1 mx-2 ${
                index < currentStep ? 'bg-arl-green' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default StepIndicator
