'use client'

import React, {
  useState,
  Children,
  useRef,
  useLayoutEffect,
  HTMLAttributes,
  ReactNode,
} from 'react'
import { motion, AnimatePresence, Variants } from 'motion/react'
import { Check } from 'lucide-react'

interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  initialStep?: number
  onStepChange?: (step: number) => void
  onFinalStepCompleted?: () => boolean | Promise<boolean | void> | void
  stepCircleContainerClassName?: string
  stepContainerClassName?: string
  contentClassName?: string
  footerClassName?: string
  backButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>
  nextButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>
  backButtonText?: string
  nextButtonText?: string
  disableStepIndicators?: boolean
  renderStepIndicator?: (props: {
    step: number
    currentStep: number
    onStepClick: (clicked: number) => void
  }) => ReactNode
}

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  stepCircleContainerClassName = '',
  stepContainerClassName = '',
  contentClassName = '',
  footerClassName = '',
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = 'Kembali',
  nextButtonText = 'Selanjutnya',
  disableStepIndicators = false,
  renderStepIndicator,
  ...rest
}: StepperProps) {
  const [currentStep, setCurrentStep] = useState<number>(initialStep)
  const [direction, setDirection] = useState<number>(0)
  const stepsArray = Children.toArray(children)
  const totalSteps = stepsArray.length
  const isCompleted = currentStep > totalSteps
  const isLastStep = currentStep === totalSteps

  const updateStep = (newStep: number) => {
    setCurrentStep(newStep)
    if (newStep <= totalSteps) {
      onStepChange(newStep)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1)
      updateStep(currentStep - 1)
    }
  }

  const handleNext = () => {
    if (!isLastStep) {
      setDirection(1)
      updateStep(currentStep + 1)
    }
  }

  const handleComplete = async () => {
    setDirection(1)
    const result = await onFinalStepCompleted()
    if (result !== false) {
      updateStep(totalSteps + 1)
    }
  }

  return (
    <div
      className="flex min-h-full flex-1 flex-col items-center justify-center p-4 w-full"
      {...rest}
    >
      <div
        className={`mx-auto w-full max-w-xl rounded-2xl shadow-[0_14px_40px_rgba(11,37,64,0.08)] bg-white border border-[#edf3fb] overflow-hidden flex flex-col ${stepCircleContainerClassName}`}
      >
        <div
          className={`${stepContainerClassName} flex w-full items-center justify-center px-8 pt-8 pb-4`}
        >
          <div className="flex w-full max-w-sm items-center justify-between">
            {stepsArray.map((_, index) => {
              const stepNumber = index + 1
              const isNotLastStep = index < totalSteps - 1
              return (
                <React.Fragment key={stepNumber}>
                  {renderStepIndicator ? (
                    renderStepIndicator({
                      step: stepNumber,
                      currentStep,
                      onStepClick: (clicked) => {
                        setDirection(clicked > currentStep ? 1 : -1)
                        updateStep(clicked)
                      },
                    })
                  ) : (
                    <StepIndicator
                      step={stepNumber}
                      disableStepIndicators={disableStepIndicators}
                      currentStep={currentStep}
                      onClickStep={(clicked) => {
                        setDirection(clicked > currentStep ? 1 : -1)
                        updateStep(clicked)
                      }}
                    />
                  )}
                  {isNotLastStep && <StepConnector isComplete={currentStep > stepNumber} />}
                </React.Fragment>
              )
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <StepContentWrapper
            isCompleted={isCompleted}
            currentStep={currentStep}
            direction={direction}
            className={`px-6 sm:px-10 pb-2 text-[#112032] ${contentClassName}`}
          >
            {stepsArray[currentStep - 1]}
          </StepContentWrapper>
        </div>

        {!isCompleted && (
          <div
            className={`px-6 sm:px-10 py-6 border-t border-[#edf3fb] bg-[#f9fbfe] ${footerClassName}`}
          >
            <div
              className={`flex items-center ${currentStep !== 1 ? 'justify-between' : 'justify-end'}`}
            >
              {currentStep !== 1 && (
                <button
                  onClick={handleBack}
                  className={`duration-200 rounded-lg px-5 py-2.5 transition text-sm font-medium ${
                    currentStep === 1
                      ? 'pointer-events-none opacity-50 text-[#516070]'
                      : 'text-[#516070] hover:bg-[#edf3fb] hover:text-[#0b2540]'
                  }`}
                  {...backButtonProps}
                >
                  {backButtonText}
                </button>
              )}
              <button
                onClick={isLastStep ? handleComplete : handleNext}
                className="duration-200 flex items-center justify-center rounded-lg bg-[#0b2540] hover:bg-[#183b63] py-2.5 px-6 text-sm font-medium tracking-tight text-white transition active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-sm"
                {...nextButtonProps}
              >
                {isLastStep ? 'Kirim Pengajuan' : nextButtonText}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface StepContentWrapperProps {
  isCompleted: boolean
  currentStep: number
  direction: number
  children: ReactNode
  className?: string
}

function StepContentWrapper({
  isCompleted,
  currentStep,
  direction,
  children,
  className = '',
}: StepContentWrapperProps) {
  const [parentHeight, setParentHeight] = useState<number | 'auto'>('auto')

  return (
    <motion.div
      style={{ position: 'relative', overflow: 'hidden' }}
      animate={{ height: isCompleted ? 0 : parentHeight }}
      transition={{ type: 'spring', duration: 0.4 }}
      className={className}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition
            key={currentStep}
            direction={direction}
            onHeightReady={(h) => setParentHeight(h)}
          >
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

interface SlideTransitionProps {
  children: ReactNode
  direction: number
  onHeightReady: (height: number) => void
}

function SlideTransition({ children, direction, onHeightReady }: SlideTransitionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    if (containerRef.current) {
      // Small timeout to ensure child images/content are rendered
      const updateHeight = () => {
        if (containerRef.current) {
          onHeightReady(containerRef.current.offsetHeight)
        }
      }
      updateHeight()

      const observer = new ResizeObserver(updateHeight)
      observer.observe(containerRef.current)
      return () => observer.disconnect()
    }
  }, [children, onHeightReady])

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{ position: 'absolute', left: 0, right: 0, top: 0, paddingBottom: '1rem' }}
    >
      {children}
    </motion.div>
  )
}

const stepVariants: Variants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? '-20%' : '20%',
    opacity: 0,
  }),
  center: {
    x: '0%',
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? '20%' : '-20%',
    opacity: 0,
  }),
}

interface StepProps {
  children: ReactNode
}

export function Step({ children }: StepProps) {
  return <div className="py-2 w-full">{children}</div>
}

interface StepIndicatorProps {
  step: number
  currentStep: number
  onClickStep: (clicked: number) => void
  disableStepIndicators?: boolean
}

function StepIndicator({
  step,
  currentStep,
  onClickStep,
  disableStepIndicators = false,
}: StepIndicatorProps) {
  const status = currentStep === step ? 'active' : currentStep < step ? 'inactive' : 'complete'

  const handleClick = () => {
    if (step !== currentStep && !disableStepIndicators) {
      onClickStep(step)
    }
  }

  return (
    <motion.div
      onClick={handleClick}
      className={`relative outline-none focus:outline-none shrink-0 ${disableStepIndicators ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
      animate={status}
      initial={false}
    >
      <motion.div
        variants={{
          inactive: {
            scale: 1,
            backgroundColor: '#f3f7fc',
            color: '#516070',
            border: '1px solid #edf3fb',
          },
          active: {
            scale: 1,
            backgroundColor: '#0b2540',
            color: '#ffffff',
            border: '1px solid #0b2540',
          },
          complete: {
            scale: 1,
            backgroundColor: '#1d9e75',
            color: '#ffffff',
            border: '1px solid #1d9e75',
          },
        }}
        transition={{ duration: 0.2 }}
        className="flex h-8 w-8 items-center justify-center rounded-full font-medium shadow-sm text-sm z-10 relative"
      >
        {status === 'complete' ? (
          <Check className="h-4 w-4 text-white" strokeWidth={3} />
        ) : (
          <span>{step}</span>
        )}
      </motion.div>
    </motion.div>
  )
}

interface StepConnectorProps {
  isComplete: boolean
}

function StepConnector({ isComplete }: StepConnectorProps) {
  const lineVariants: Variants = {
    incomplete: { width: 0, backgroundColor: 'transparent' },
    complete: { width: '100%', backgroundColor: '#1d9e75' },
  }

  return (
    <div className="relative h-1 flex-1 min-w-[2rem] overflow-hidden rounded bg-[#f3f7fc] mx-2">
      <motion.div
        className="absolute left-0 top-0 h-full"
        variants={lineVariants}
        initial={false}
        animate={isComplete ? 'complete' : 'incomplete'}
        transition={{ duration: 0.3 }}
      />
    </div>
  )
}
