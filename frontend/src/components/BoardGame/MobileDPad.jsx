import { memo } from 'react'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, CornerDownLeft } from 'lucide-react'
import { motion } from 'framer-motion'

// Liquid Glass D-Pad Button
const DPadButton = memo(({ onClick, children, variant = 'default', className = '' }) => {
    const variants = {
        default: 'bg-white/25 dark:bg-slate-800/25 text-slate-700 dark:text-slate-200 border-white/30',
        action: 'bg-emerald-500/30 text-emerald-700 dark:text-emerald-200 border-emerald-300/40'
    }
    
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`
                relative overflow-hidden w-14 h-14 rounded-2xl
                backdrop-blur-xl border shadow-lg
                transition-all duration-200
                ${variants[variant]} ${className}
            `}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
            <div className="relative z-10 flex items-center justify-center">
                {children}
            </div>
        </motion.button>
    )
})

DPadButton.displayName = 'DPadButton'

function MobileDPad({ onUp, onDown, onLeft, onRight, onEnter }) {
    return (
        <div className="lg:hidden fixed bottom-6 right-6 flex flex-col items-center gap-2.5 z-30">
            {/* Up */}
            <DPadButton onClick={onUp}>
                <ChevronUp size={26} strokeWidth={2.5} />
            </DPadButton>
            
            {/* Middle Row: Left, Enter, Right */}
            <div className="flex gap-2.5">
                <DPadButton onClick={onLeft}>
                    <ChevronLeft size={26} strokeWidth={2.5} />
                </DPadButton>
                <DPadButton onClick={onEnter} variant="action">
                    <CornerDownLeft size={22} strokeWidth={2.5} />
                </DPadButton>
                <DPadButton onClick={onRight}>
                    <ChevronRight size={26} strokeWidth={2.5} />
                </DPadButton>
            </div>
            
            {/* Down */}
            <DPadButton onClick={onDown}>
                <ChevronDown size={26} strokeWidth={2.5} />
            </DPadButton>
        </div>
    )
}

export default memo(MobileDPad)
