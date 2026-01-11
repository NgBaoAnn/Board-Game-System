import React from 'react'

/**
 * Checkerboard grid that can render content inside each cell.
 * Props:
 *  - rows: number of rows
 *  - cols: number of columns
 *  - cellSize: pixel size for each square
 *  - onCellClick: callback(row, col)
 *  - renderContent: optional renderer (row, col) => ReactNode
 *  - getCellClassName: optional (row, col) => string for custom cell classes
 */
export default function BoardGrid({ rows = 13, cols = 13, cellSize = 48, onCellClick, renderContent, getCellClassName }) {
    const cells = Array.from({ length: rows * cols }, (_, i) => {
        const row = Math.floor(i / cols)
        const col = i % cols
        const isDark = (row + col) % 2 === 0
        return { row, col, isDark, key: `${row}-${col}` }
    })

    return (
        <div
            className="w-full h-full flex items-center justify-center"
            style={{ minHeight: rows * cellSize, minWidth: cols * cellSize }}
        >
            <div
                className="grid"
                style={{
                    gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
                    gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                    borderRadius: 16,
                    overflow: 'hidden',
                }}
            >
                {cells.map((cell) => {
                    const customClass = getCellClassName ? getCellClassName(cell.row, cell.col) : ''
                    return (
                        <button
                            key={cell.key}
                            type="button"
                            aria-label={`cell-${cell.row}-${cell.col}`}
                            onClick={() => onCellClick?.(cell.row, cell.col)}
                            style={{
                                width: cellSize,
                                height: cellSize,
                                backgroundColor: cell.isDark ? '#10b981' : '#c7f9cc',
                                border: '1px solid rgba(255,255,255,0.08)',
                            }}
                            className={`relative transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-emerald-300 ${customClass}`}
                        >
                            {renderContent ? (
                                <span className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold text-slate-900">
                                    {renderContent(cell.row, cell.col)}
                                </span>
                            ) : null}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
