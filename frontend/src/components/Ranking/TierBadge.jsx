import { motion } from 'framer-motion'
import { Star, Gem, Trophy, Medal } from 'lucide-react'

/**
 * TierBadge - Gaming-style tier badge with icon and gradient
 * @param {Object} props
 * @param {string} props.tier - Tier name (grandmaster, diamond, platinum, gold, silver, bronze)
 * @param {string} props.size - Badge size (sm, md, lg)
 */
export function TierBadge({ tier, size = 'md' }) {
  const tierConfig = {
    grandmaster: {
      label: 'Grandmaster',
      icon: Star,
      className: 'tier-grandmaster',
      iconCount: 3,
    },
    diamond: {
      label: 'Diamond',
      icon: Gem,
      className: 'tier-diamond',
      iconCount: 1,
    },
    platinum: {
      label: 'Platinum',
      icon: Trophy,
      className: 'tier-platinum',
      iconCount: 1,
    },
    gold: {
      label: 'Gold',
      icon: Medal,
      className: 'tier-gold',
      iconCount: 1,
    },
    silver: {
      label: 'Silver',
      icon: Medal,
      className: 'tier-silver',
      iconCount: 1,
    },
    bronze: {
      label: 'Bronze',
      icon: Medal,
      className: 'tier-bronze',
      iconCount: 1,
    },
  }

  const tierKey = tier?.toLowerCase().replace(' league', '').replace(' player', '').trim()
  const config = tierConfig[tierKey] || tierConfig.bronze
  const IconComponent = config.icon

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2',
  }

  const iconSizes = {
    sm: 10,
    md: 12,
    lg: 14,
  }

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center rounded-full font-bold text-white ${config.className} ${sizeClasses[size]}`}
    >
      <span className="flex items-center gap-0.5">
        {config.iconCount > 1 ? (
          Array.from({ length: config.iconCount }).map((_, i) => (
            <IconComponent key={i} size={iconSizes[size]} className="fill-current" />
          ))
        ) : (
          <IconComponent size={iconSizes[size]} className="fill-current" />
        )}
      </span>
      <span>{config.label}</span>
    </motion.span>
  )
}

export default TierBadge
