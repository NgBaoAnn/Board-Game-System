import { memo, useState } from 'react'
import { Modal, Radio } from 'antd'
import { Clock, Play, Timer } from 'lucide-react'
import { motion } from 'framer-motion'

// Minimal Button
const MinimalButton = memo(({ onClick, children, variant = 'default', className = '' }) => {
    const variants = {
        default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700',
        primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20'
    }
    
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`
                w-full h-12 rounded-xl font-bold
                transition-all duration-200
                ${variants[variant]} ${className}
            `}
        >
            <span className="flex items-center justify-center gap-2">{children}</span>
        </motion.button>
    )
})

MinimalButton.displayName = 'MinimalButton'

function TimeSelectionModal({ open, onClose, onConfirm, gameName = "Game" }) {
    const [selectedTime, setSelectedTime] = useState(180) // Default 3 minutes

    const timeOptions = [
        { value: 60, label: '1 Minute', icon: Timer, color: 'text-rose-500 bg-rose-50 dark:bg-rose-900/20', activeBorder: 'border-rose-500' },
        { value: 180, label: '3 Minutes', icon: Timer, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20', activeBorder: 'border-indigo-500' },
        { value: 300, label: '5 Minutes', icon: Timer, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20', activeBorder: 'border-emerald-500' },
        { value: 600, label: '10 Minutes', icon: Timer, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20', activeBorder: 'border-amber-500' },
    ]

    const handleConfirm = () => {
        onConfirm(selectedTime)
        onClose()
    }

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            width={400}
            closeIcon={null}
            destroyOnHidden
            modalRender={(modal) => (
                <div onMouseDown={(e) => e.stopPropagation()} className="pointer-events-auto">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white dark:bg-slate-900 rounded-[24px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 pb-4 text-center border-b border-slate-100 dark:border-slate-800">
                            <div className="w-12 h-12 mx-auto mb-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                                <Clock size={24} className="text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Select Duration</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Choose time limit for {gameName}</p>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <Radio.Group
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                className="w-full"
                            >
                                <div className="grid grid-cols-1 gap-3">
                                    {timeOptions.map((option) => {
                                        const IconComp = option.icon
                                        const formattedTime = option.value >= 60 ? `${Math.floor(option.value / 60)}m` : `${option.value}s`
                                        const isSelected = selectedTime === option.value
                                        
                                        return (
                                            <Radio key={option.value} value={option.value} className="w-full group">
                                                <div className={`
                                                    flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all cursor-pointer
                                                    ${isSelected
                                                        ? `${option.activeBorder} bg-slate-50 dark:bg-slate-800`
                                                        : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                                                    }
                                                `}>
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${option.color}`}>
                                                        <IconComp size={20} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <span className={`font-bold block ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                                            {option.label}
                                                        </span>
                                                    </div>
                                                    <div className={`text-sm font-medium ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                                                        {formattedTime}
                                                    </div>
                                                </div>
                                            </Radio>
                                        )
                                    })}
                                </div>
                            </Radio.Group>

                            {/* Actions */}
                            <div className="flex gap-3 mt-6">
                                <MinimalButton onClick={onClose} variant="default">
                                    Cancel
                                </MinimalButton>
                                <MinimalButton onClick={handleConfirm} variant="primary">
                                    <Play size={18} />
                                    Start Game
                                </MinimalButton>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        />
    )
}

export default memo(TimeSelectionModal)
