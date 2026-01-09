import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

/**
 * SectionHeader component - Displays a section title with optional action link or navigation buttons
 * @param {Object} props
 * @param {string} props.title - Section title
 * @param {string} props.viewAllLink - Optional link for "View All" button
 * @param {boolean} props.showNavigation - Show navigation arrows
 * @param {Function} props.onPrevious - Callback for previous button
 * @param {Function} props.onNext - Callback for next button
 */
export default function SectionHeader({
  title,
  viewAllLink,
  showNavigation = false,
  onPrevious,
  onNext,
}) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">{title}</h3>
      
      {viewAllLink && (
        <Link to={viewAllLink} className="text-sm font-bold text-blue-500 hover:underline">
          View All
        </Link>
      )}

      {showNavigation && (
        <div className="flex gap-2">
          <button
            onClick={onPrevious}
            className="flex size-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={onNext}
            className="flex size-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  )
}
