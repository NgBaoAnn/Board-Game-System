export function ActivityCard({ activity }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-transform hover:-translate-y-1 duration-200">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700">
          {activity.image ? (
            <img src={activity.image} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl bg-gray-800">
              {activity.icon}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">{activity.title}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activity.subtitle}</p>
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
              {activity.time}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                activity.badgeType === 'success'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
              }`}
            >
              {activity.badge}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{activity.detail}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActivityCard
