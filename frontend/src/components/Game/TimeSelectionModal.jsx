import { useState } from 'react'
import { Modal, Radio, Button } from 'antd'
import { Clock, Infinity, Play } from 'lucide-react'

/**
 * TimeSelectionModal - Modal cho phép người dùng chọn thời gian chơi
 * @param {boolean} open - Modal đang mở hay không
 * @param {function} onClose - Callback khi đóng modal
 * @param {function} onConfirm - Callback khi xác nhận (timeInSeconds)
 * @param {string} gameName - Tên game đang chơi
 */
export default function TimeSelectionModal({ open, onClose, onConfirm, gameName = "Game" }) {
    const [selectedTime, setSelectedTime] = useState(180) // Default 3 minutes

    const timeOptions = [
        { value: 60, label: '1 Phút', icon: '⚡' },
        { value: 180, label: '3 Phút', icon: '🎯' },
        { value: 300, label: '5 Phút', icon: '⏱️' },
        { value: 600, label: '10 Phút', icon: '🏆' },
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
            className="time-selection-modal"
            styles={{
                content: {
                    borderRadius: 24,
                    padding: 0,
                    overflow: 'hidden',
                },
            }}
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Clock size={32} />
                </div>
                <h2 className="text-xl font-bold mb-1">Chọn Thời Gian</h2>
                <p className="text-white/80 text-sm">{gameName}</p>
            </div>

            {/* Time Options */}
            <div className="p-6">
                <Radio.Group
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full"
                >
                    <div className="grid grid-cols-1 gap-3">
                        {timeOptions.map((option) => (
                            <Radio
                                key={option.value}
                                value={option.value}
                                className="w-full"
                            >
                                <div className={`
                                    flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer
                                    ${selectedTime === option.value
                                        ? 'border-indigo-500 bg-indigo-50'
                                        : 'border-slate-200 hover:border-indigo-200'
                                    }
                                `}>
                                    <span className="text-2xl">{option.icon}</span>
                                    <div className="flex-1">
                                        <span className="font-semibold text-slate-800">{option.label}</span>
                                        {option.value > 0 && (
                                            <span className="text-slate-400 text-sm ml-2">
                                                ({Math.floor(option.value / 60)} phút)
                                            </span>
                                        )}
                                    </div>
                                    {option.value === 0 && (
                                        <Infinity size={20} className="text-indigo-500" />
                                    )}
                                </div>
                            </Radio>
                        ))}
                    </div>
                </Radio.Group>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                    <Button
                        onClick={onClose}
                        className="flex-1 h-12 rounded-xl font-semibold"
                    >
                        Hủy
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleConfirm}
                        className="flex-1 h-12 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 border-none hover:opacity-90"
                        icon={<Play size={18} />}
                    >
                        Bắt Đầu
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
