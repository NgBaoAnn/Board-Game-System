import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { Modal } from 'antd'
import { Save, LogOut, AlertTriangle, GamepadIcon } from 'lucide-react'

const GameSessionContext = createContext(null)

/**
 * GameSessionProvider - Bảo vệ game session
 * - Chặn navigation sang trang khác khi game đang chơi
 * - Chặn đóng browser/tab khi game đang chơi
 * - Hiển thị modal với 2 options: Lưu hoặc Thoát
 */
export function GameSessionProvider({ children }) {
    const [isGameActive, setIsGameActive] = useState(false)
    const [showExitModal, setShowExitModal] = useState(false)
    const [pendingNavigation, setPendingNavigation] = useState(null) // { path, navigateFn }

    const saveCallbackRef = useRef(null)
    const exitCallbackRef = useRef(null)

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isGameActive) {
                e.preventDefault()
                e.returnValue = 'Bạn có game đang chơi dở. Bạn có muốn lưu trước khi thoát không?'
                return e.returnValue
            }
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [isGameActive])

    const startSession = useCallback((saveCallback, exitCallback) => {
        setIsGameActive(true)
        saveCallbackRef.current = saveCallback
        exitCallbackRef.current = exitCallback
    }, [])

    const endSession = useCallback(() => {
        setIsGameActive(false)
        saveCallbackRef.current = null
        exitCallbackRef.current = null
        setPendingNavigation(null)
    }, [])

    const requestNavigation = useCallback((targetPath, navigateFn) => {
        if (!isGameActive) {
            return true // allowed
        }
        setPendingNavigation({ path: targetPath, navigateFn })
        setShowExitModal(true)
        return false // blocked
    }, [isGameActive])

    const handleSave = async () => {
        try {
            if (saveCallbackRef.current) {
                await saveCallbackRef.current()
            }
            setShowExitModal(false)
            setIsGameActive(false)

            if (pendingNavigation?.navigateFn) {
                pendingNavigation.navigateFn()
            }
            setPendingNavigation(null)
        } catch (err) {
            console.error('Save failed:', err)
        }
    }

    const handleExit = async () => {
        try {
            if (exitCallbackRef.current) {
                await exitCallbackRef.current()
            }
            setShowExitModal(false)
            setIsGameActive(false)

            if (pendingNavigation?.navigateFn) {
                pendingNavigation.navigateFn()
            }
            setPendingNavigation(null)
        } catch (err) {
            console.error('Exit failed:', err)
        }
    }

    const handleCancel = () => {
        setShowExitModal(false)
        setPendingNavigation(null)
    }

    const value = {
        isGameActive,
        startSession,
        endSession,
        requestNavigation,
    }

    return (
        <GameSessionContext.Provider value={value}>
            {children}

            
            <Modal
                open={showExitModal}
                onCancel={handleCancel}
                footer={null}
                centered
                width={420}
                closable={false}
                maskClosable={false}
                styles={{
                    content: {
                        borderRadius: 24,
                        padding: 0,
                        overflow: 'hidden',
                    },
                }}
            >
                
                <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <AlertTriangle size={32} />
                    </div>
                    <h2 className="text-xl font-bold mb-1">⚠️ Game Đang Chơi!</h2>
                    <p className="text-white/90 text-sm">
                        Bạn có game chưa hoàn thành. Vui lòng chọn hành động:
                    </p>
                </div>

                
                <div className="p-6 space-y-3 bg-slate-50">
                    
                    <button
                        onClick={handleSave}
                        className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                    >
                        <Save size={22} />
                        <div className="text-left">
                            <div>Lưu Game</div>
                            <div className="text-xs font-normal opacity-80">Tiến trình sẽ được lưu lại</div>
                        </div>
                    </button>

                    
                    <button
                        onClick={handleExit}
                        className="w-full py-4 px-6 bg-gradient-to-r from-rose-500 to-red-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                    >
                        <LogOut size={22} />
                        <div className="text-left">
                            <div>Thoát Game</div>
                            <div className="text-xs font-normal opacity-80">Kết thúc và tính điểm</div>
                        </div>
                    </button>

                    
                    <button
                        onClick={handleCancel}
                        className="w-full py-3 px-6 bg-white text-slate-600 font-semibold rounded-xl border border-slate-200 hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                    >
                        <GamepadIcon size={18} />
                        Tiếp Tục Chơi
                    </button>
                </div>
            </Modal>
        </GameSessionContext.Provider>
    )
}

/**
 * Hook to use game session protection
 */
export function useGameSession() {
    const context = useContext(GameSessionContext)
    if (!context) {
        return {
            isGameActive: false,
            startSession: () => { },
            endSession: () => { },
            requestNavigation: () => true,
        }
    }
    return context
}

export default GameSessionProvider
