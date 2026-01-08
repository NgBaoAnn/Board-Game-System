import { Input, Select, Segmented } from 'antd'
import { Search } from 'lucide-react'

// Leaderboard Filters Component
export function LeaderboardFilters({
  searchText,
  onSearchChange,
  viewMode,
  onViewModeChange,
  gameFilter,
  onGameFilterChange,
  periodFilter,
  onPeriodFilterChange,
}) {
  return (
    <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-700">
      <Input
        placeholder="Search player..."
        prefix={<Search className="text-gray-400" size={18} />}
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-xs rounded-lg"
        size="large"
      />
      <div className="flex items-center gap-3 flex-wrap">
        <Segmented
          value={viewMode}
          onChange={onViewModeChange}
          options={['Global', 'Friends']}
          className="bg-gray-100 dark:bg-gray-700"
        />
        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 hidden md:block" />
        <Select
          value={gameFilter}
          onChange={onGameFilterChange}
          className="min-w-[150px]"
          options={[
            { value: 'all', label: 'All Games' },
            { value: 'chess', label: 'Chess' },
            { value: 'catan', label: 'Catan' },
            { value: 'monopoly', label: 'Monopoly' },
          ]}
        />
        <Select
          value={periodFilter}
          onChange={onPeriodFilterChange}
          className="min-w-[140px]"
          options={[
            { value: 'season', label: 'This Season' },
            { value: 'alltime', label: 'All Time' },
            { value: 'month', label: 'Last Month' },
          ]}
        />
      </div>
    </div>
  )
}

export default LeaderboardFilters
