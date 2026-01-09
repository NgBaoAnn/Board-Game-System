import { useState, useEffect, useCallback, useMemo } from 'react'
import { Palette, Eraser, RotateCcw, Download, Pipette } from 'lucide-react'

/**
 * FreeDrawGame - Pixel Art Drawing Game
 * 
 * Features:
 * - White canvas grid for drawing
 * - Color palette to select colors
 * - Click or keyboard to paint cells
 * - Eraser tool
 * - Clear canvas
 * - Save/Export drawing
 * 
 * Controls:
 * - Arrow keys / WASD: Move cursor on canvas
 * - Enter/Space: Paint current cell with selected color
 * - G: Switch to color palette mode
 * - In palette mode: Arrow keys to navigate, Enter to select color
 * - E: Toggle eraser
 * - C: Clear canvas
 */

// Color palette - 8 colors per row (2 rows)
const COLOR_PALETTE = [
    '#000000', // Black
    '#FFFFFF', // White
    '#FF0000', // Red
    '#FF8C00', // Orange
    '#FFD93D', // Yellow
    '#6BCB77', // Green
    '#4D96FF', // Blue
    '#6F69AC', // Purple
    '#FF6B9D', // Pink
    '#A0522D', // Brown
    '#808080', // Gray
    '#00CED1', // Cyan
    '#FF1493', // Deep Pink
    '#32CD32', // Lime
    '#FFD700', // Gold
    '#8B4513', // Saddle Brown
]

const PALETTE_COLS = 8 // 8 colors per row
const PALETTE_ROWS = Math.ceil(COLOR_PALETTE.length / PALETTE_COLS)

export default function FreeDrawGame({
    isPlaying = false,
    score = 0,
    onScoreChange,
    onGameEnd,
    savedState = null,
    onStateChange,
    boardRows = 20,
    boardCols = 20,
    cursorRow = 0,
    cursorCol = 0,
    cellClickRef,
}) {
    // Initialize canvas - 2D array of colors (null = white/empty)
    const createEmptyCanvas = useCallback(() => {
        return Array(boardRows).fill(null).map(() => Array(boardCols).fill(null))
    }, [boardRows, boardCols])

    // Game state
    const [canvas, setCanvas] = useState(() => savedState?.canvas || createEmptyCanvas())
    const [selectedColor, setSelectedColor] = useState(savedState?.selectedColor || '#000000')
    const [isEraser, setIsEraser] = useState(false)
    const [pixelCount, setPixelCount] = useState(savedState?.pixelCount || 0)
    const [lastAction, setLastAction] = useState(null)

    // Palette navigation state
    const [isPaletteMode, setIsPaletteMode] = useState(false)
    const [paletteCursorIndex, setPaletteCursorIndex] = useState(0)

    // Calculate cell size based on board dimensions
    const cellSize = useMemo(() => {
        return Math.max(16, Math.min(24, 480 / Math.max(boardRows, boardCols)))
    }, [boardRows, boardCols])

    // Count painted pixels
    useEffect(() => {
        let count = 0
        canvas.forEach(row => {
            row.forEach(cell => {
                if (cell !== null) count++
            })
        })
        setPixelCount(count)
        // Free Draw does not count score - just for fun!
    }, [canvas])

    // Paint a cell
    const paintCell = useCallback((row, col) => {
        if (!isPlaying) return

        setCanvas(prev => {
            const newCanvas = prev.map(r => [...r])
            if (isEraser) {
                newCanvas[row][col] = null
                setLastAction({ type: 'erase', row, col })
            } else {
                newCanvas[row][col] = selectedColor
                setLastAction({ type: 'paint', row, col, color: selectedColor })
            }
            return newCanvas
        })
    }, [isPlaying, isEraser, selectedColor])

    // Handle cell click
    const handleCellClick = useCallback((row, col) => {
        paintCell(row, col)
    }, [paintCell])

    // Expose cell click through ref for keyboard controls
    useEffect(() => {
        if (cellClickRef) {
            cellClickRef.current = handleCellClick
        }
    }, [cellClickRef, handleCellClick])

    // Clear canvas
    const clearCanvas = useCallback(() => {
        setCanvas(createEmptyCanvas())
        setLastAction({ type: 'clear' })
    }, [createEmptyCanvas])

    // Toggle eraser
    const toggleEraser = useCallback(() => {
        setIsEraser(prev => !prev)
    }, [])

    // Pick color from canvas (eyedropper)
    const pickColor = useCallback((row, col) => {
        const color = canvas[row]?.[col]
        if (color) {
            setSelectedColor(color)
            setIsEraser(false)
        }
    }, [canvas])

    // Keyboard shortcuts for tools
    useEffect(() => {
        if (!isPlaying) return

        const handleToolKeyDown = (e) => {
            // If in palette mode, handle palette navigation
            if (isPaletteMode) {
                const currentRow = Math.floor(paletteCursorIndex / PALETTE_COLS)
                const currentCol = paletteCursorIndex % PALETTE_COLS

                switch (e.key) {
                    case 'ArrowUp':
                    case 'w':
                    case 'W':
                        e.preventDefault()
                        e.stopPropagation()
                        if (currentRow > 0) {
                            setPaletteCursorIndex(prev => prev - PALETTE_COLS)
                        }
                        break
                    case 'ArrowDown':
                    case 's':
                    case 'S':
                        e.preventDefault()
                        e.stopPropagation()
                        if (currentRow < PALETTE_ROWS - 1) {
                            const newIndex = paletteCursorIndex + PALETTE_COLS
                            if (newIndex < COLOR_PALETTE.length) {
                                setPaletteCursorIndex(newIndex)
                            }
                        }
                        break
                    case 'ArrowLeft':
                    case 'a':
                    case 'A':
                        e.preventDefault()
                        e.stopPropagation()
                        if (currentCol > 0) {
                            setPaletteCursorIndex(prev => prev - 1)
                        }
                        break
                    case 'ArrowRight':
                    case 'd':
                    case 'D':
                        e.preventDefault()
                        e.stopPropagation()
                        if (currentCol < PALETTE_COLS - 1 && paletteCursorIndex + 1 < COLOR_PALETTE.length) {
                            setPaletteCursorIndex(prev => prev + 1)
                        }
                        break
                    case 'Enter':
                    case ' ':
                        e.preventDefault()
                        e.stopPropagation()
                        // Select color and exit palette mode
                        setSelectedColor(COLOR_PALETTE[paletteCursorIndex])
                        setIsEraser(false)
                        setIsPaletteMode(false)
                        break
                    case 'Escape':
                    case 'g':
                    case 'G':
                        e.preventDefault()
                        e.stopPropagation()
                        // Exit palette mode without changing color
                        setIsPaletteMode(false)
                        break
                    default:
                        break
                }
                return
            }

            // Normal mode (canvas) keyboard shortcuts
            switch (e.key.toLowerCase()) {
                case 'g':
                    e.preventDefault()
                    e.stopPropagation()
                    // Enter palette mode
                    setIsPaletteMode(true)
                    // Set cursor to currently selected color
                    const colorIndex = COLOR_PALETTE.indexOf(selectedColor)
                    if (colorIndex >= 0) {
                        setPaletteCursorIndex(colorIndex)
                    }
                    break
                case 'e':
                    e.preventDefault()
                    toggleEraser()
                    break
                case 'c':
                    if (e.ctrlKey || e.metaKey) return // Don't interfere with copy
                    e.preventDefault()
                    clearCanvas()
                    break
                case 'p':
                    e.preventDefault()
                    // Pick color from current cursor position
                    pickColor(cursorRow, cursorCol)
                    break
                default:
                    break
            }
        }

        // Use capture phase to handle before BoardGamePage
        window.addEventListener('keydown', handleToolKeyDown, true)
        return () => window.removeEventListener('keydown', handleToolKeyDown, true)
    }, [isPlaying, isPaletteMode, paletteCursorIndex, selectedColor, toggleEraser, clearCanvas, pickColor, cursorRow, cursorCol])

    // Notify parent of state changes
    useEffect(() => {
        onStateChange?.({
            canvas,
            selectedColor,
            pixelCount,
        })
    }, [canvas, selectedColor, pixelCount, onStateChange])

    // Render the drawing canvas
    const renderCanvas = () => {
        return (
            <div
                className="grid bg-white border-2 border-slate-300 rounded-lg overflow-hidden shadow-lg"
                style={{
                    gridTemplateColumns: `repeat(${boardCols}, ${cellSize}px)`,
                    gridTemplateRows: `repeat(${boardRows}, ${cellSize}px)`,
                }}
            >
                {Array.from({ length: boardRows * boardCols }, (_, i) => {
                    const row = Math.floor(i / boardCols)
                    const col = i % boardCols
                    const cellColor = canvas[row]?.[col]
                    const isCursor = cursorRow === row && cursorCol === col

                    return (
                        <button
                            key={`${row}-${col}`}
                            type="button"
                            onClick={() => handleCellClick(row, col)}
                            onContextMenu={(e) => {
                                e.preventDefault()
                                // Right click to pick color
                                pickColor(row, col)
                            }}
                            className={`
                                relative transition-all duration-75
                                ${isCursor ? 'z-10' : ''}
                                hover:brightness-90
                            `}
                            style={{
                                width: cellSize,
                                height: cellSize,
                                backgroundColor: cellColor || '#FFFFFF',
                                border: '1px solid #e5e7eb',
                            }}
                        >
                            {/* Cursor indicator */}
                            {isCursor && (
                                <div 
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                        border: `3px solid ${isEraser ? '#ef4444' : selectedColor}`,
                                        boxShadow: `0 0 8px ${isEraser ? 'rgba(239, 68, 68, 0.6)' : selectedColor}`,
                                    }}
                                />
                            )}
                        </button>
                    )
                })}
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Toolbar */}
            <div className="flex items-center gap-3 flex-wrap justify-center">
                {/* Pixel count */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-lg">
                    <Palette size={14} className="text-indigo-500" />
                    <span className="font-semibold text-indigo-700">Pixels: {pixelCount}</span>
                </div>

                {/* Eraser toggle */}
                <button
                    onClick={toggleEraser}
                    className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold text-sm transition-all
                        ${isEraser 
                            ? 'bg-rose-500 text-white shadow-md' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }
                    `}
                >
                    <Eraser size={14} />
                    <span>Tẩy (E)</span>
                </button>

                {/* Clear button */}
                <button
                    onClick={clearCanvas}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg font-semibold text-sm transition-all"
                >
                    <RotateCcw size={14} />
                    <span>Xóa (C)</span>
                </button>

                
            </div>

            {/* Color palette */}
            <div 
                className={`
                    px-3 py-2 rounded-xl transition-all
                    ${isPaletteMode 
                        ? 'bg-indigo-100 ring-2 ring-indigo-500 shadow-lg' 
                        : 'bg-slate-50'
                    }
                `}
            >
                {isPaletteMode && (
                    <div className="text-xs text-indigo-600 font-semibold mb-1 text-center animate-pulse">
                        🎨 Dùng ←→ để chọn màu, Enter xác nhận
                    </div>
                )}
                <div 
                    className="grid gap-1"
                    style={{
                        gridTemplateColumns: `repeat(${PALETTE_COLS}, 1fr)`,
                    }}
                >
                    {COLOR_PALETTE.map((color, index) => {
                        const isSelected = selectedColor === color && !isEraser
                        const isPaletteCursor = isPaletteMode && paletteCursorIndex === index

                        return (
                            <button
                                key={color}
                                onClick={() => {
                                    setSelectedColor(color)
                                    setIsEraser(false)
                                    setIsPaletteMode(false)
                                }}
                                className={`
                                    w-7 h-7 rounded transition-all border-2 relative
                                    ${isSelected
                                        ? 'ring-2 ring-offset-1 ring-indigo-500 scale-110 border-indigo-500'
                                        : 'border-slate-300 hover:scale-105'
                                    }
                                    ${isPaletteCursor 
                                        ? 'ring-3 ring-offset-1 ring-rose-500 scale-125 z-10' 
                                        : ''
                                    }
                                `}
                                style={{ backgroundColor: color }}
                                title={`${color}${isPaletteCursor ? ' (đang chọn)' : ''}`}
                            >
                                {isPaletteCursor && (
                                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                                )}
                            </button>
                        )
                    })}
                </div>
                {!isPaletteMode && (
                    <div className="text-xs text-slate-400 mt-2 text-center">
                        Nhấn <span className="font-mono bg-slate-200 px-1 rounded">G</span> để chọn màu bằng bàn phím
                    </div>
                )}
            </div>

            {/* Current color indicator */}
            <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500">Màu đang chọn:</span>
                <div
                    className="w-10 h-10 rounded-lg border-2 border-slate-400 shadow-md"
                    style={{ backgroundColor: isEraser ? '#FFFFFF' : selectedColor }}
                />
                <span className="text-sm font-mono text-slate-600">
                    {isEraser ? 'Eraser' : selectedColor}
                </span>
            </div>

            {/* Canvas */}
            {renderCanvas()}

            {/* Instructions */}
            <div className="text-xs text-slate-400 text-center max-w-sm space-y-1">
                <div>
                    Di chuyển bằng <span className="font-mono bg-slate-100 px-1 rounded">↑↓←→</span> • 
                    Nhấn <span className="font-mono bg-slate-100 px-1 rounded">Enter</span> để vẽ
                </div>
                <div>
                    <span className="font-mono bg-slate-100 px-1 rounded">G</span> chọn màu • 
                    <span className="font-mono bg-slate-100 px-1 rounded">E</span> tẩy • 
                    <span className="font-mono bg-slate-100 px-1 rounded">C</span> xóa • 
                    <span className="font-mono bg-slate-100 px-1 rounded">P</span> lấy màu
                </div>
            </div>

            {/* Last action feedback */}
            {lastAction && (
                <div className="text-xs text-slate-500">
                    {lastAction.type === 'paint' && `Đã vẽ tại (${lastAction.row}, ${lastAction.col})`}
                    {lastAction.type === 'erase' && `Đã xóa tại (${lastAction.row}, ${lastAction.col})`}
                    {lastAction.type === 'clear' && 'Đã xóa toàn bộ canvas'}
                </div>
            )}
        </div>
    )
}
