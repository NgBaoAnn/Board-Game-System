import { Chrome, Facebook } from 'lucide-react'

/**
 * SocialLoginButtons component - Renders Google and Facebook login buttons
 * @param {Object} props
 * @param {Function} props.onGoogleClick
 * @param {Function} props.onFacebookClick
 */
export default function SocialLoginButtons({ onGoogleClick, onFacebookClick }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        type="button"
        onClick={onGoogleClick}
        className="flex items-center justify-center w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-slate-800 dark:text-gray-100 font-medium transition-colors cursor-pointer"
      >
        <Chrome size={20} className="mr-2 text-red-500" />
        Google
      </button>
      <button
        type="button"
        onClick={onFacebookClick}
        className="flex items-center justify-center w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-slate-800 dark:text-gray-100 font-medium transition-colors cursor-pointer"
      >
        <Facebook size={20} className="mr-2 text-blue-600" />
        Facebook
      </button>
    </div>
  )
}
