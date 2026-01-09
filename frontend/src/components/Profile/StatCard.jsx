// Stat Card Component
export function StatCard({ value, label }) {
  return (
    <div className="text-center px-6 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
      <span className="block text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</span>
    </div>
  )
}

export default StatCard
