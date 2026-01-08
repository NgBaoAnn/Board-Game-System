import { Tag } from 'antd'

/**
 * NewArrivalCard component - Displays a new arrival game card with NEW badge
 * @param {Object} game - Game object with id, title, category, image
 */
export default function NewArrivalCard({ game }) {
  return (
    <div className="min-w-[280px] group relative flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-sm transition-all hover:shadow-md">
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl bg-gray-200">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url("${game.image}")` }}
        />
        <Tag color="blue" className="absolute left-2 top-2 font-bold border-0">
          NEW
        </Tag>
      </div>
      <div className="flex flex-col gap-1 px-1">
        <h4 className="text-base font-bold text-slate-800">{game.title}</h4>
        <p className="text-xs text-slate-500">{game.category}</p>
      </div>
    </div>
  )
}
