import { Input, Segmented } from 'antd'
import { Search } from 'lucide-react'

export function LeaderboardFilters({
  searchText,
  onSearchChange,
  viewMode,
  onViewModeChange,
}) {
  return (
    <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-700">
      <Input
        placeholder="Search player..."
        prefix={<Search className="text-gray-400" size={18} />}
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-xs rounded-lg"
        size="large"
      />
      <Segmented
        value={viewMode}
        onChange={onViewModeChange}
        options={['Global', 'Friends']}
        className="bg-gray-100 dark:bg-slate-700"
      />
    </div>
  )
}

export default LeaderboardFilters
