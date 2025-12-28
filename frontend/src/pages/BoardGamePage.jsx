

import { useState } from 'react'
import {
    Gamepad2,
    Wifi,
    ChevronRight,
    Heart,
    Grid3x3,
    AppWindow,
    Dice6,
    Circle,
    ArrowLeft,
    ArrowRight,
    Play,
    Pause,
    HelpCircle,
    Sun,
} from 'lucide-react'

import BoardGrid from '../components/Board/BoardGrid.jsx'
export default function BoardGamePage() {
    const games = [
        { title: 'Pixel Heart', subtitle: 'Currently Selected', icon: <Heart size={18} className="text-rose-400" /> },
        { title: 'Tic-tac-toe', subtitle: 'Classic Mode', icon: <Grid3x3 size={18} className="text-slate-300" /> },
        { title: 'Caro / Gomoku', subtitle: '5-in-a-row', icon: <AppWindow size={18} className="text-slate-300" /> },
        { title: 'Random Game', subtitle: 'Surprise me', icon: <Dice6 size={18} className="text-slate-300" /> },
    ]

    const [activeIndex, setActiveIndex] = useState(0)

    const selectIndex = (idx) => {
        setActiveIndex((idx + games.length) % games.length)
    }

    const handleRight = () => selectIndex(activeIndex + 1) // right = xuống dưới
    const handleLeft = () => selectIndex(activeIndex - 1) // left = lên trên
    const handleStart = () => {
        // TODO: start selected game
    }

    return (
        <div className="min-h-screen bg-[#0e152a] text-slate-100 flex flex-col">
            {/* Header */}
            <header className="h-16 px-8 flex items-center justify-between bg-[#1e293b] backdrop-blur border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Gamepad2 size={20} />
                    </div>
                    <div className="flex flex-col leading-tight">
                        <span className="text-sm uppercase tracking-[0.18em] text-slate-400">Retro</span>
                        <span className="text-lg font-semibold text-white">Board</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-emerald-400">
                        <Circle size={10} className="fill-emerald-400 text-emerald-400" />
                        <span className="hidden sm:inline">Connected</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-slate-300">
                        <Wifi size={16} />
                        <span>Player One</span>
                        <span className="text-slate-500">|</span>
                        <span className="text-xs text-slate-400">Level 42</span>
                        <div className="ml-2 h-9 w-9 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">P1</div>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="flex-1 px-8 py-8 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">
                {/* Left panel with board background */}
                <div>
                    <BoardGrid />
                </div>

                {/* Right panel */}
                <div className="rounded-2xl border border-slate-800 bg-[#1e293b] shadow-xl overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-slate-800">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Select Cartridge</p>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                        {games.map((item, idx) => {
                            const active = idx === activeIndex
                            return (
                                <button
                                    key={item.title}
                                    onClick={() => selectIndex(idx)}
                                    className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 transition-all text-left ${active
                                        ? 'bg-slate-800/80 border-blue-500/50 shadow-[0_0_0_1px_rgba(59,130,246,0.3)]'
                                        : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`h-9 w-9 rounded-xl flex items-center justify-center ${active ? 'bg-blue-600/80 text-white' : 'bg-slate-800 text-slate-200'
                                                }`}
                                        >
                                            {item.icon}
                                        </div>
                                        <div className="leading-tight">
                                            <p className="text-sm font-semibold text-white">{item.title}</p>
                                            <p className="text-xs text-slate-400">{item.subtitle}</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-slate-500" />
                                </button>
                            )
                        })}
                    </div>

                    <div className="relative border-t border-slate-800 bg-[#192332] pt-6 pb-15 px-6 rounded-b-2xl overflow-hidden">
                        {/* top pill indicator */}
                        <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 h-1 w-24 rounded-full bg-slate-700" />

                        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 text-center mb-4">Controller</p>

                        <div className="grid grid-cols-3 items-center gap-3 mb-5">
                            <div className="col-span-1 flex justify-center">
                                <button className="h-14 w-14 rounded-2xl bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center hover:border-slate-500 shadow-inner">
                                    <HelpCircle size={20} />
                                </button>
                            </div>
                            <div className="col-span-1" />
                            <div className="col-span-1 flex justify-center">
                                <button className="h-14 px-5 rounded-2xl bg-rose-600 text-white border border-rose-500/70 hover:border-rose-400 text-sm font-semibold shadow-lg shadow-rose-500/30">
                                    BACK
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-1 items-center justify-center">
                            <div className="col-span-1 flex justify-center">
                                <button
                                    onClick={handleLeft}
                                    className="h-14 w-14 rounded-full bg-slate-800 text-slate-100 border border-slate-700 flex items-center justify-center hover:border-slate-500 shadow-inner"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                            </div>

                            <div className="col-span-1 flex items-center justify-center gap-4">

                                <button
                                    onClick={handleStart}
                                    className="h-16 w-16 rounded-full bg-[#1da1f2] text-white shadow-[0_8px_24px_rgba(29,161,242,0.35)] flex items-center justify-center border border-[#1b8cd9]"
                                >
                                    <Play size={20} />
                                </button>

                            </div>

                            <div className="col-span-1 flex justify-center">
                                <button
                                    onClick={handleRight}
                                    className="h-14 w-14 rounded-full bg-slate-800 text-slate-100 border border-slate-700 flex items-center justify-center hover:border-slate-500 shadow-inner"
                                >
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>




                    </div>
                </div>
            </main>
        </div>
    )
}


