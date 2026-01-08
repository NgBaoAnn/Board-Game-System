/**
 * QuickActions component - Displays quick action buttons grid
 * @param {Object} props
 * @param {Array} props.actions - Array of action objects with id, title, icon, color
 * @param {Function} props.onActionClick - Callback when an action is clicked
 */
export default function QuickActions({ actions, onActionClick }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-bold tracking-tight text-slate-800">Quick Actions</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {actions.map((action) => {
          const IconComponent = action.icon
          return (
            <button
              key={action.id}
              onClick={() => onActionClick?.(action.id)}
              className="group flex h-24 flex-col items-center justify-center gap-2 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md"
            >
              <div className={`rounded-full p-2 ${action.color}`}>
                <IconComponent size={28} />
              </div>
              <span className="text-sm font-bold text-slate-800">{action.title}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
