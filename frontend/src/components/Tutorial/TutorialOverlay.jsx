import { memo, useState, useCallback, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X, HelpCircle } from 'lucide-react'
import { markTutorialCompleted } from './tutorialData'

/**
 * TutorialOverlay - Interactive step-by-step tutorial overlay
 * 
 * Features:
 * - Center-positioned tooltip with step content
 * - Navigation buttons (Prev/Next/Skip)
 * - Step indicator (1/5)
 * - Dark backdrop
 * - Auto-save completion to localStorage
 */
function TutorialOverlay({
    isActive,
    steps = [],
    gameCode = '',
    onComplete,
    onSkip
}) {
    const [currentStep, setCurrentStep] = useState(0)
    const [isVisible, setIsVisible] = useState(false)

    // Reset step when tutorial starts
    useEffect(() => {
        if (isActive) {
            setCurrentStep(0)
            setIsVisible(true)
        } else {
            setIsVisible(false)
        }
    }, [isActive])

    // Handle next step
    const handleNext = useCallback(() => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1)
        } else {
            // Last step - complete tutorial
            markTutorialCompleted(gameCode)
            setIsVisible(false)
            onComplete?.()
        }
    }, [currentStep, steps.length, gameCode, onComplete])

    // Handle previous step
    const handlePrev = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1)
        }
    }, [currentStep])

    // Handle skip
    const handleSkip = useCallback(() => {
        markTutorialCompleted(gameCode)
        setIsVisible(false)
        onSkip?.()
    }, [gameCode, onSkip])

    // Keyboard navigation
    useEffect(() => {
        if (!isVisible) return

        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowRight':
                case 'Enter':
                case ' ':
                    e.preventDefault()
                    e.stopPropagation()
                    handleNext()
                    break
                case 'ArrowLeft':
                    e.preventDefault()
                    e.stopPropagation()
                    handlePrev()
                    break
                case 'Escape':
                    e.preventDefault()
                    e.stopPropagation()
                    handleSkip()
                    break
                default:
                    break
            }
        }

        // Use capture to intercept before game components
        window.addEventListener('keydown', handleKeyDown, true)
        return () => window.removeEventListener('keydown', handleKeyDown, true)
    }, [isVisible, handleNext, handlePrev, handleSkip])

    if (!isVisible || steps.length === 0) return null

    const step = steps[currentStep]
    const isFirstStep = currentStep === 0
    const isLastStep = currentStep === steps.length - 1

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Dark backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={handleSkip}
            />

            {/* Tutorial card */}
            <div
                className="relative z-10 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-300"
                style={{ animation: 'slideUp 0.3s ease-out' }}
            >
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white">
                            <HelpCircle size={24} />
                            <span className="font-semibold">Hướng dẫn chơi</span>
                        </div>
                        <button
                            onClick={handleSkip}
                            className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/20"
                            title="Bỏ qua (Esc)"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">
                            {step.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            {step.description}
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
                        {/* Step indicator */}
                        <div className="flex items-center gap-2">
                            {steps.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-2 h-2 rounded-full transition-all duration-200 ${idx === currentStep
                                            ? 'bg-indigo-500 w-4'
                                            : idx < currentStep
                                                ? 'bg-indigo-300'
                                                : 'bg-gray-300'
                                        }`}
                                />
                            ))}
                            <span className="text-sm text-gray-500 ml-2">
                                {currentStep + 1}/{steps.length}
                            </span>
                        </div>

                        {/* Navigation buttons */}
                        <div className="flex items-center gap-2">
                            {!isFirstStep && (
                                <button
                                    onClick={handlePrev}
                                    className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    <ChevronLeft size={18} />
                                    <span className="text-sm">Trước</span>
                                </button>
                            )}
                            <button
                                onClick={handleNext}
                                className="flex items-center gap-1 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors font-medium"
                            >
                                <span className="text-sm">
                                    {isLastStep ? 'Bắt đầu!' : 'Tiếp'}
                                </span>
                                {!isLastStep && <ChevronRight size={18} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Skip hint */}
                <div className="text-center mt-3">
                    <button
                        onClick={handleSkip}
                        className="text-white/60 hover:text-white/90 text-sm transition-colors"
                    >
                        Nhấn Esc để bỏ qua
                    </button>
                </div>
            </div>

            {/* Slide up animation */}
            <style>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    )
}

export default memo(TutorialOverlay)
