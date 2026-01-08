import { useMemo } from 'react'

/**
 * PasswordStrength - Visual indicator for password strength
 * @param {Object} props
 * @param {string} props.password - Current password value
 */
export default function PasswordStrength({ password = '' }) {
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: '' }

    let score = 0

    // Length check
    if (password.length >= 6) score += 1
    if (password.length >= 10) score += 1

    // Character diversity
    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^a-zA-Z0-9]/.test(password)) score += 1

    // Normalize to 0-4 scale
    const normalizedScore = Math.min(Math.floor(score / 1.5), 4)

    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
    const colors = ['', 'bg-red-500', 'bg-yellow-400', 'bg-blue-500', 'bg-green-500']
    const textColors = [
      '',
      'text-red-500 dark:text-red-400',
      'text-yellow-600 dark:text-yellow-400',
      'text-blue-600 dark:text-blue-400',
      'text-green-600 dark:text-green-400',
    ]

    return {
      score: normalizedScore,
      label: labels[normalizedScore],
      color: colors[normalizedScore],
      textColor: textColors[normalizedScore],
    }
  }, [password])

  if (!password) return null

  return (
    <div className="mt-2 flex items-center gap-2">
      <div className="h-1 flex-1 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${strength.color}`}
          style={{ width: `${(strength.score / 4) * 100}%` }}
        />
      </div>
      <span className={`text-xs font-medium ${strength.textColor}`}>{strength.label}</span>
    </div>
  )
}
