import { motion } from 'framer-motion'

/**
 * QuickActions component - Gaming-themed quick action buttons with gradient backgrounds
 * @param {Object} props
 * @param {Array} props.actions - Array of action objects with id, title, icon, colorClass
 * @param {Function} props.onActionClick - Callback when an action is clicked
 */
export default function QuickActions({ actions, onActionClick }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {actions.map((action) => {
          const IconComponent = action.icon
          return (
            <motion.button
              key={action.id}
              onClick={() => onActionClick?.(action.id)}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`group flex h-28 flex-col items-center justify-center gap-3 rounded-xl p-4 shadow-lg transition-all ${action.colorClass} dark:bg-slate-800 dark:border-0`}
            >
              <motion.div 
                className={`rounded-xl p-3 ${action.iconBg}`}
                whileHover={{ rotate: 10 }}
              >
                <IconComponent 
                  size={28} 
                  className={`${action.iconColor} drop-shadow-lg`}
                  style={{
                    filter: 'drop-shadow(0 0 8px currentColor)',
                  }}
                />
              </motion.div>
              <span className="text-sm font-bold text-slate-800 dark:text-white">
                {action.title}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
