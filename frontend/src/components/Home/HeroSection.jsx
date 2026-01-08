import { Button, Tag } from 'antd'
import { Star } from 'lucide-react'

/**
 * HeroSection component - Displays the featured game hero banner
 * @param {Object} props
 * @param {string} props.title - Hero title
 * @param {string} props.description - Hero description
 * @param {string} props.image - Background image URL
 * @param {number} props.rating - Game rating
 * @param {string} props.tag - Featured tag text (e.g., "Featured Game")
 * @param {Function} props.onPlayNow - Callback when Play Now is clicked
 * @param {Function} props.onWatchTutorial - Callback when Watch Tutorial is clicked
 */
export default function HeroSection({
  title = 'Strategy Awaits: Master Catan Today',
  description = 'Join over 10,000 players in the ultimate classic strategy game. Build settlements, trade resources, and pave your way to victory.',
  image,
  rating = 4.9,
  tag = 'Featured Game',
  onPlayNow,
  onWatchTutorial,
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
        <div className="flex flex-col justify-center gap-6 p-8 md:p-12">
          <div className="flex items-center gap-2">
            <Tag color="orange" className="font-medium border-0">
              {tag}
            </Tag>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
              <Star size={14} className="text-yellow-500 fill-yellow-500" /> {rating}
            </span>
          </div>
          <div>
            <h2 className="mb-3 text-3xl font-black leading-tight tracking-tight text-slate-800 md:text-4xl lg:text-5xl">
              {title}
            </h2>
            <p className="text-base font-normal leading-relaxed text-slate-500">
              {description}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              type="primary"
              size="large"
              className="h-12 px-6 font-bold rounded-xl"
              style={{ backgroundColor: '#0d7ff2' }}
              onClick={onPlayNow}
            >
              Play Now
            </Button>
            <Button
              size="large"
              className="h-12 px-6 font-bold rounded-xl bg-slate-100 border-0 text-slate-700 hover:!bg-slate-200 hover:!text-slate-800"
              onClick={onWatchTutorial}
            >
              Watch Tutorial
            </Button>
          </div>
        </div>
        <div
          className="relative min-h-[300px] w-full bg-cover bg-center md:h-auto"
          style={{ backgroundImage: `url("${image}")` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r md:from-black/10 md:to-transparent" />
        </div>
      </div>
    </div>
  )
}
