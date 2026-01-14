import { useState } from 'react'
import { Star } from 'lucide-react'

/**
 * StarRating component - Display or interactive star rating
 * @param {number} rating - Current rating value (0-5)
 * @param {number} maxStars - Maximum stars to display (default: 5)
 * @param {boolean} interactive - Whether user can click to rate
 * @param {Function} onRate - Callback when user rates (receives new rating)
 * @param {string} size - Size variant: 'sm', 'md', 'lg'
 * @param {boolean} showValue - Whether to show numeric value
 */
export default function StarRating({
    rating = 0,
    maxStars = 5,
    interactive = false,
    onRate,
    size = 'md',
    showValue = false,
    className = '',
}) {
    const [hoverRating, setHoverRating] = useState(0)

    const sizes = {
        sm: { star: 12, text: 'text-xs', gap: 'gap-0.5' },
        md: { star: 16, text: 'text-sm', gap: 'gap-1' },
        lg: { star: 24, text: 'text-lg', gap: 'gap-1.5' },
    }

    const { star: starSize, text: textSize, gap } = sizes[size] || sizes.md

    const handleClick = (index) => {
        if (interactive && onRate) {
            onRate(index + 1)
        }
    }

    const handleMouseEnter = (index) => {
        if (interactive) {
            setHoverRating(index + 1)
        }
    }

    const handleMouseLeave = () => {
        if (interactive) {
            setHoverRating(0)
        }
    }

    const displayRating = hoverRating || rating

    const renderStar = (index) => {
        const filled = index < Math.floor(displayRating)
        const halfFilled = !filled && index < displayRating && index >= Math.floor(displayRating)

        return (
            <button
                key={index}
                type="button"
                onClick={() => handleClick(index)}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                disabled={!interactive}
                className={`relative transition-all duration-200 ${
                    interactive 
                        ? 'cursor-pointer hover:scale-110' 
                        : 'cursor-default'
                }`}
            >
                {/* Background star (empty) */}
                <Star
                    size={starSize}
                    className="text-slate-300 dark:text-slate-600"
                />
                
                {/* Filled star overlay */}
                {(filled || halfFilled) && (
                    <Star
                        size={starSize}
                        className={`absolute inset-0 text-yellow-400 fill-yellow-400 ${
                            interactive && hoverRating > 0 
                                ? 'drop-shadow-[0_0_6px_rgba(250,204,21,0.6)]' 
                                : ''
                        }`}
                        style={halfFilled ? { clipPath: 'inset(0 50% 0 0)' } : {}}
                    />
                )}
            </button>
        )
    }

    return (
        <div className={`flex items-center ${gap} ${className}`}>
            <div className={`flex items-center ${gap}`}>
                {Array.from({ length: maxStars }, (_, i) => renderStar(i))}
            </div>
            {showValue && (
                <span className={`font-bold text-yellow-600 dark:text-yellow-400 ${textSize}`}>
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    )
}
