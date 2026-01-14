import React, { memo, useMemo } from 'react'

/**
 * Optimized BoardGrid with React.memo and memoized cells
 * Props:
 *  - rows: number of rows
 *  - cols: number of columns
 *  - cellSize: pixel size for each square
 *  - onCellClick: callback(row, col)
 *  - renderContent: optional renderer (row, col) => ReactNode
 *  - getCellClassName: optional (row, col) => string for custom cell classes
 */

// Memoized Cell component to prevent unnecessary re-renders
const BoardCell = memo(({ row, col, cellSize, isDark, onCellClick, renderContent, customClass }) => {
    return (
        <button
            type="button"
            aria-label={`cell-${row}-${col}`}
            onClick={() => onCellClick?.(row, col)}
            style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: isDark ? '#10b981' : '#c7f9cc',
                border: '1px solid rgba(255,255,255,0.08)',
            }}
            className={`relative transition-all duration-150 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-emerald-300 ${customClass}`}
        >
            {renderContent && (
                <span className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold text-slate-900 pointer-events-none">
                    {renderContent(row, col)}
                </span>
            )}
        </button>
    )
})

BoardCell.displayName = 'BoardCell'

function BoardGrid({ rows = 13, cols = 13, cellSize = 48, onCellClick, renderContent, getCellClassName }) {
    // Memoize cells array to prevent recreation on every render
    const cells = useMemo(() => 
        Array.from({ length: rows * cols }, (_, i) => {
            const row = Math.floor(i / cols)
            const col = i % cols
            const isDark = (row + col) % 2 === 0
            return { row, col, isDark, key: `${row}-${col}` }
        }),
        [rows, cols]
    )

    // Memoize grid styles
    const gridStyle = useMemo(() => ({
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        borderRadius: 16,
        overflow: 'hidden',
    }), [cols, rows, cellSize])

    const containerStyle = useMemo(() => ({
        minHeight: rows * cellSize,
        minWidth: cols * cellSize
    }), [rows, cols, cellSize])

    return (
        <div
            className="w-full h-full flex items-center justify-center"
            style={containerStyle}
        >
            <div className="grid" style={gridStyle}>
                {cells.map((cell) => {
                    const customClass = getCellClassName ? getCellClassName(cell.row, cell.col) : ''
                    return (
                        <BoardCell
                            key={cell.key}
                            row={cell.row}
                            col={cell.col}
                            cellSize={cellSize}
                            isDark={cell.isDark}
                            onCellClick={onCellClick}
                            renderContent={renderContent}
                            customClass={customClass}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default memo(BoardGrid)
