import { Modal } from 'antd'
import { HelpCircle, Trophy, Keyboard, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Minimal Modal Wrapper
function ContentModal({ open, onClose, children, width = 420 }) {
    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            width={width}
            closeIcon={null}
            destroyOnHidden
            modalRender={(modal) => (
                <div onMouseDown={(e) => e.stopPropagation()} className="pointer-events-auto">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative bg-white dark:bg-slate-900 rounded-[24px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                    >
                        {children}
                    </motion.div>
                </div>
            )}
        />
    )
}

// Minimal Close Button
function MinimalCloseButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors duration-200"
        >
            <X size={16} className="text-slate-500 dark:text-slate-400" />
        </button>
    )
}

// Minimal Action Button
function MinimalActionButton({ onClick, children, variant = 'primary', className = '' }) {
    const variants = {
        primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20',
        success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20',
        danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-500/20',
        amber: 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20',
        ghost: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
    }
    
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`
                w-full py-3.5 font-bold rounded-xl
                transition-all duration-200
                ${variants[variant]} ${className}
            `}
        >
            {children}
        </motion.button>
    )
}

// Minimal Key Hint
function MinimalKeyHint({ keys, label }) {
    return (
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">{label}</span>
            <div className="flex items-center gap-1.5">
                {keys.map((key, i) => (
                    <kbd 
                        key={i}
                        className="min-w-[32px] h-8 px-2 rounded-lg bg-white dark:bg-slate-700 border-b-2 border-slate-200 dark:border-slate-600 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200"
                    >
                        {key}
                    </kbd>
                ))}
            </div>
        </div>
    )
}

export default function GameModals({
    showHelp,
    showAchievement,
    showExitConfirm,
    showSwitchConfirm,
    achievements = [],
    onCloseHelp,
    onCloseAchievement,
    onExitConfirm,
    onExitCancel,
    onSwitchConfirm,
    onSwitchCancel
}) {
    return (
        <>
            {/* Help Modal */}
            <ContentModal open={showHelp} onClose={onCloseHelp}>
                <div className="relative">
                    <MinimalCloseButton onClick={onCloseHelp} />
                    
                    {/* Header */}
                    <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                                <Keyboard size={24} className="text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Game Controls</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Keyboard shortcuts</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 space-y-3">
                        <MinimalKeyHint keys={['W', 'A', 'S', 'D']} label="Move cursor" />
                        <MinimalKeyHint keys={['↑', '↓', '←', '→']} label="Arrow keys" />
                        <MinimalKeyHint keys={['Enter']} label="Confirm action" />
                        <MinimalKeyHint keys={['Esc']} label="Pause game" />
                        
                        <div className="pt-4">
                            <MinimalActionButton onClick={onCloseHelp} variant="primary">
                                Got it!
                            </MinimalActionButton>
                        </div>
                    </div>
                </div>
            </ContentModal>

            {/* Achievement Modal */}
            <ContentModal open={showAchievement} onClose={onCloseAchievement} width={400}>
                <div className="relative">
                    <MinimalCloseButton onClick={onCloseAchievement} />
                    
                    {/* Header */}
                    <div className="p-8 pb-6 text-center bg-gradient-to-b from-amber-50/50 to-transparent dark:from-amber-900/10">
                        <motion.div 
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', damping: 12, stiffness: 100 }}
                            className="relative w-20 h-20 mx-auto mb-4 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center"
                        >
                            <Trophy size={40} className="text-amber-500 dark:text-amber-400" />
                        </motion.div>
                        
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Achievement Unlocked!</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Congratulations on your progress</p>
                    </div>
                    
                    {/* Achievements list */}
                    <div className="p-6 pt-0">
                        <div className="space-y-3 max-h-[200px] overflow-y-auto mb-6">
                            {achievements.map((achievement, index) => (
                                <motion.div
                                    key={achievement.id || index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800"
                                >
                                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center shrink-0">
                                        <Trophy size={20} className="text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-slate-900 dark:text-white truncate">
                                            {achievement.name || 'New Achievement'}
                                        </div>
                                        {achievement.description && (
                                            <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                                                {achievement.description}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <MinimalActionButton onClick={onCloseAchievement} variant="amber">
                            Awesome!
                        </MinimalActionButton>
                    </div>
                </div>
            </ContentModal>

            {/* Switch Game Confirmation Modal */}
            <ContentModal open={showSwitchConfirm} onClose={onSwitchCancel} width={360}>
                <div className="relative text-center p-6 pt-10">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                        <HelpCircle size={32} className="text-indigo-500" />
                    </div>
                        
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Switch Game?</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
                        Do you want to save your current progress before switching?
                    </p>
                    
                    <div className="space-y-3">
                        <MinimalActionButton onClick={() => onSwitchConfirm(true)} variant="primary">
                            Save & Switch
                        </MinimalActionButton>
                        <MinimalActionButton onClick={() => onSwitchConfirm(false)} variant="danger">
                            Switch without Saving
                        </MinimalActionButton>
                        <MinimalActionButton onClick={onSwitchCancel} variant="ghost">
                            Cancel
                        </MinimalActionButton>
                    </div>
                </div>
            </ContentModal>

            {/* Exit Confirmation Modal */}
            <ContentModal open={showExitConfirm} onClose={onExitCancel} width={360}>
                <div className="relative text-center p-6 pt-10">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center">
                        <X size={32} className="text-rose-500" />
                    </div>
                        
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Exit Game?</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
                        Your unsaved progress will be lost. Are you sure you want to leave?
                    </p>
                    
                    <div className="space-y-3">
                        <MinimalActionButton onClick={onExitConfirm} variant="danger">
                            Exit Game
                        </MinimalActionButton>
                        <MinimalActionButton onClick={onExitCancel} variant="ghost">
                            Continue Playing
                        </MinimalActionButton>
                    </div>
                </div>
            </ContentModal>
        </>
    )
}
