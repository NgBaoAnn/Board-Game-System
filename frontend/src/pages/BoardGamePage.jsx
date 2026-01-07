import { useState } from 'react'
import {
    Heart,
    Grid3x3,
    Circle,
    Dice6,
    ChevronLeft,
    ChevronRight,
    Play,
    HelpCircle,
    Undo2,
} from 'lucide-react'

import BoardGrid from '../components/Board/BoardGrid.jsx'

export default function BoardGamePage() {
    const games = [
        { id: 'pixel-heart', title: 'Pixel Heart', subtitle: 'Selected', icon: Heart, iconColor: 'text-rose-500' },
        { id: 'tictactoe', title: 'Tic-tac-toe', subtitle: 'Classic', icon: Grid3x3, iconColor: '' },
        { id: 'gomoku', title: 'Gomoku', subtitle: 'Strategy', icon: Circle, iconColor: '' },
        { id: 'random', title: 'Random', subtitle: 'Surprise', icon: Dice6, iconColor: '' },
    ]

    const [activeGame, setActiveGame] = useState(0)

    const selectGame = (idx) => {
        setActiveGame((idx + games.length) % games.length)
    }

    const handleLeft = () => selectGame(activeGame - 1)
    const handleRight = () => selectGame(activeGame + 1)
    const handleStart = () => {
        // TODO: Start selected game
    }

    return (
        <div className="flex flex-col h-full">
            {/* Game Selector */}
            <section className="shrink-0 bg-white border-b border-slate-100 p-4 rounded-xl mb-4 shadow-sm">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-3">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-500 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                            Select Cartridge
                        </h2>
                        <div className="hidden md:flex text-[10px] font-bold text-slate-400 gap-4">
                            <span className="flex items-center gap-1">
                                <span className="text-indigo-500">●</span> ACTIVE
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="text-slate-300">●</span> AVAILABLE
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {games.map((game, idx) => {
                            const isActive = idx === activeGame
                            const IconComponent = game.icon
                            return (
                                <button
                                    key={game.id}
                                    onClick={() => selectGame(idx)}
                                    className={`group flex items-center gap-3 p-3 rounded-xl text-left transition-all relative overflow-hidden ${isActive
                                            ? 'bg-white border-2 border-indigo-500 shadow-sm'
                                            : 'border border-slate-100 bg-white hover:bg-slate-50 hover:border-indigo-200 hover:shadow-sm'
                                        }`}
                                >
                                    <div
                                        className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center transition-colors ${isActive
                                                ? 'bg-gradient-to-br from-rose-400 to-rose-500 text-white shadow-sm ring-2 ring-rose-100'
                                                : 'bg-slate-100 group-hover:bg-indigo-100 text-slate-400 group-hover:text-indigo-500'
                                            }`}
                                    >
                                        <IconComponent size={18} />
                                    </div>
                                    <div className="z-10">
                                        <h3
                                            className={`font-bold text-sm leading-tight ${isActive ? 'text-slate-800' : 'text-slate-600 group-hover:text-slate-800'
                                                }`}
                                        >
                                            {game.title}
                                        </h3>
                                        <p
                                            className={`text-[10px] font-semibold ${isActive ? 'text-indigo-500' : 'text-slate-400 group-hover:text-slate-500'
                                                }`}
                                        >
                                            {isActive ? 'Selected' : game.subtitle}
                                        </p>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Board Display Area */}
            <section className="flex-grow relative flex items-center justify-center p-4 lg:p-6 bg-slate-50 rounded-xl overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none"></div>

                {/* Board container */}
                <div className="relative z-10 bg-white p-2 sm:p-3 rounded-2xl shadow-lg border border-slate-100/60 ring-1 ring-slate-100 max-h-full flex items-center justify-center">
                    <div className="bg-indigo-50/50 rounded-xl p-4 sm:p-6 border border-indigo-100/50 relative overflow-hidden">
                        {/* Label */}
                        <div className="absolute top-2 left-4 text-[9px] font-bold text-indigo-300 tracking-widest z-20">
                            MATRIX DISPLAY 13×13
                        </div>

                        {/* Grid background */}
                        <div className="absolute inset-0 grid-bg pointer-events-none"></div>

                        {/* Board Grid */}
                        <div className="relative z-10 mt-4">
                            <BoardGrid />
                        </div>
                    </div>
                </div>
            </section>

            {/* Controls Section */}
            <section className="shrink-0 bg-white border-t border-slate-100 p-4 mt-4 rounded-xl shadow-sm">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Help button */}
                    <div className="order-2 md:order-1 flex-1 flex justify-center md:justify-start">
                        <button
                            aria-label="Help"
                            className="arcade-btn px-4 py-3 rounded-xl bg-slate-100 text-slate-500 shadow-[0_3px_0_#cbd5e1] hover:bg-slate-200 text-xs font-bold flex items-center gap-2 transition-colors"
                        >
                            <HelpCircle size={16} /> HELP
                        </button>
                    </div>

                    {/* Navigation controls */}
                    <div className="order-1 md:order-2 flex items-center gap-4 sm:gap-6">
                        <button
                            onClick={handleLeft}
                            aria-label="Left"
                            className="arcade-btn w-14 h-14 rounded-full bg-white text-slate-600 border border-slate-200 shadow-[0_4px_0_#cbd5e1] hover:bg-slate-50 hover:text-indigo-500 transition-colors flex items-center justify-center"
                        >
                            <ChevronLeft size={28} />
                        </button>

                        <button
                            onClick={handleStart}
                            aria-label="Start"
                            className="arcade-btn w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-b from-indigo-500 to-indigo-600 text-white shadow-[0_6px_0_#3730a3] hover:brightness-110 transition-all flex flex-col items-center justify-center relative border-4 border-indigo-100"
                        >
                            <span className="text-[9px] mb-0.5 font-bold opacity-90 tracking-wide">START</span>
                            <Play size={28} />
                        </button>

                        <button
                            onClick={handleRight}
                            aria-label="Right"
                            className="arcade-btn w-14 h-14 rounded-full bg-white text-slate-600 border border-slate-200 shadow-[0_4px_0_#cbd5e1] hover:bg-slate-50 hover:text-indigo-500 transition-colors flex items-center justify-center"
                        >
                            <ChevronRight size={28} />
                        </button>
                    </div>

                    {/* Back button */}
                    <div className="order-3 md:order-3 flex-1 flex justify-center md:justify-end">
                        <button
                            aria-label="Back"
                            className="arcade-btn px-4 py-3 rounded-xl bg-rose-500 text-white shadow-[0_3px_0_#be123c] hover:bg-rose-600 text-xs font-bold flex items-center gap-2 transition-colors tracking-wide"
                        >
                            BACK <Undo2 size={16} />
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}
