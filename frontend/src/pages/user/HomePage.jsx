import { useState } from 'react'
import { LayoutGrid, PlusCircle, Shuffle, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import GameCard from '@/components/Game/GameCard'
import NewArrivalCard from '@/components/Game/NewArrivalCard'
import HeroSection from '@/components/Home/HeroSection'
import QuickActions from '@/components/Home/QuickActions'
import SectionHeader from '@/components/common/SectionHeader'

// Hero image for featured game
const heroImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6nScqmqkDA1m73ZB3NIoVYRn-NoVZhlNJ6nHG9PfYNu9htB7sIwq13rXhzRACpmWTVotZmL-bJXc11wxiETP5COG0Do-JqiTUHndRbDQ9_yIdOhsXxOZbyGrpxvBaQ442jGILlt7ODsA-E1sYMF7xoGFwMX6tyG1iJLemgwFfesLcyU_GXtdEo8fkDZaqqzyIibwLNVvNe7YDw7vflxVsUtVsL0dveXcWKhDJRmGmw9sI21nucjFIu75w23J1uoO9MYLQ78muDoix'

// Sample data with rarity, online players, and tags
const popularGames = [
  {
    id: 1,
    title: 'Monopoly Classic',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDA7vEIR_RPLJ-YS9YGou4QC8ktUwEWDbpBMcrZ3iMxUYoQpWRjw5YH_yf1-__8FYkpzxkmZFAxWkdiOY4Zft7x5_jGcvUOw_Tu6m1SFAHr05Z-RT21Dsc-xfan-JnLfC89NIt_cZTUx6ikFF_oFppVLTluEvuceyYkM0TVE24GIA9-grrgOBhGLq73GWFRcFURNUPMhn20XJ3e_V7iK7Cu97V7cloLtvm8e2AkFIR7LQO0L572Vm4bzNlfKGvpDcyH098NRfPwV1C2',
    rating: 4.5,
    players: '2-6 Players',
    duration: '60m+',
    rarity: 'legendary',
    onlinePlayers: 234,
    isHot: true,
    isNew: false,
  },
  {
    id: 2,
    title: 'Chess Arena',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJG3iIs6S7sYzD2VxpjHBJmcchytJ3n7BArtH7Wep8scO_R5UaglCjVxh9SdRRb_ysfcGsxbkl-v5p7P1RlIfA39EW5E7m91i52bzoRcDGJgHnZcy4cjSQTpcX5UZ4MS3yLpOjJVEbXIx_GD2ht_j_SLMF0TCVEJRuzWs0JuFk4FMfQ9PqSMkwUIkGmO4g1VRGtZwJ_q1YR6WLCACcKwUCtJ0_A3580MgOaBHvSYjzm3xr-pGrVhSVwMbXLimCiRJwTlQe_ia86cNZ',
    rating: 4.8,
    players: '2 Players',
    duration: '15-30m',
    rarity: 'epic',
    onlinePlayers: 567,
    isHot: false,
    isNew: false,
  },
  {
    id: 3,
    title: 'Word Master',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6A2ruZqVGA-_JXC7lNl3RFQaMgk-bU9lDIZ2ywSru1XZrKfNmg-dcygzmHrTnrwqHm81JG527rADKfuKvmxVNvaX48L-KifLS9JcneaN2xRlP4x0OeS-BGUT329xiA66KINvSSw-O1WQOaaMzukFygfDVU9L0TWWcT05BxNQi9tQ989MFm_eIFSRzgp1sWNLll6u8227Xu4JdOGLuLdjp0MBvWFTY-edcU9BKT7w3P2ln1rcc0icfn_r4TSJ9k6XfWk32q5TNKvQd',
    rating: 4.2,
    players: '2-4 Players',
    duration: '45m',
    rarity: 'rare',
    onlinePlayers: 89,
    isHot: false,
    isNew: true,
  },
  {
    id: 4,
    title: 'Poker Night',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQY-9JY2r5FbqNjNrYHA1C7TryNl0EdBTBuF1l0WXYyCZuFKJ_n4RO95zDNp3FH6Up8U7-v4DCkY0jWHVUMMuKenwsb7VBNFeR7EpJ2N6g4pnHrAe5QGfybkMR0tStnUxmtPEuyarAwwvZiCAnEZNSWu2VaqA36Qur0_KpPbdrPrabqIvIqNCsPcZF0wSZhfhJz1pOUQsapTK6rakRa0xx_LQ9daEeS4xhd9OpwMG8YrZrxvmrWUnDi4qlb9R0lGSpY3RVMeVEL6Ug',
    rating: 4.7,
    players: '2-10 Players',
    duration: '30m+',
    rarity: 'common',
    onlinePlayers: 156,
    isHot: true,
    isNew: false,
  },
]

const newArrivals = [
  {
    id: 1,
    title: 'Galaxy Trucker',
    category: 'Sci-Fi • Strategy',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3RG2UKiaLxTTqjeS62ZQP04LnQm4n1KqQbjc_VnnaC5k4u0jvPfZml8A8yQZfVyjsBlQ3g8BDIEdykad0dJCbVYN-jC_v2zDWNjanmfGHw5QIIyGtrTeY3I1VPRrbtRa40XR7T7nMxq5JNTl6vHNVTrwDXTYcEptBF3z5eU2ECk6fajQ3RgfdAu66jG2FQ6hxms7eIzJQJwZXsB17dEsjij8P964uoeEjHqib2lzYzTi-ulHoDexcGjVz4BNTFBV5TFB1OERZpQSD',
  },
  {
    id: 2,
    title: 'Dungeon Quest',
    category: 'RPG • Adventure',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYvG4yk5pzKlufV9CPh5OnzOSLfxFg8J2FYuV8kKUo47Kbn02bJovBK7R1EGeWKqV2z4P7D1n9Qzhm8-Z_nI4tzk_-bWi7l3rprnhYRoFFL1z6n_mFhRUsO1F3qmPVBejS_S3r7PxfdAp0jU_gbYj46lpQtFDn7bLzwej6ydEwW1OMX_-_8Qhk7Q_0AIMc7Y55B17RaBiSnZl37oKOFOpXHExUeTecUVf007nwvcMF3m2n-RnsfJYNAlZQEkaRfQoc6PB7RQyoWA5R',
  },
  {
    id: 3,
    title: 'Tower Tumble',
    category: 'Family • Dexterity',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBz_YidSQm793BN9aANk1G0qq4lDrO84IRPZ7HoDrZr1tXYT-JgMjuBjPyK1fAnscUjC13O7541-5-euztiITYEwrr0auOjCQDVIP30Dn1sVPYgCRIKuMNej4J5ur3_9nz8R4geyKEqfpudTgCdRjKLZjEIIxiKMqe35BQIJ1xMONtrU_QirDpyi7XjJVHYzh-b1_ytPW6lN8d0iL6F7_VnVCtrfg7_uNgOL75eUaQVNhm2nCmUgP_WCHfZqq9vVOKe9eg_q6vA9_Xv',
  },
  {
    id: 4,
    title: 'Cosmic Clash',
    category: 'Sci-Fi • Combat',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6nScqmqkDA1m73ZB3NIoVYRn-NoVZhlNJ6nHG9PfYNu9htB7sIwq13rXhzRACpmWTVotZmL-bJXc11wxiETP5COG0Do-JqiTUHndRbDQ9_yIdOhsXxOZbyGrpxvBaQ442jGILlt7ODsA-E1sYMF7xoGFwMX6tyG1iJLemgwFfesLcyU_GXtdEo8fkDZaqqzyIibwLNVvNe7YDw7vflxVsUtVsL0dveXcWKhDJRmGmw9sI21nucjFIu75w23J1uoO9MYLQ78muDoix',
  },
]

// Quick actions with gradient colors
const quickActions = [
  {
    id: 1,
    title: 'Browse Library',
    icon: LayoutGrid,
    colorClass: 'quick-action-blue',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-500',
  },
  {
    id: 2,
    title: 'Create Custom Table',
    icon: PlusCircle,
    colorClass: 'quick-action-green',
    iconBg: 'bg-green-500/20',
    iconColor: 'text-green-500',
  },
  {
    id: 3,
    title: 'Join Random Lobby',
    icon: Shuffle,
    colorClass: 'quick-action-purple',
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-500',
  },
]

export default function HomePage() {
  const [carouselIndex, setCarouselIndex] = useState(0)
  const itemsPerView = 3
  const maxIndex = Math.max(0, newArrivals.length - itemsPerView)

  const handlePlayNow = () => {
    console.log('Play Now clicked')
  }

  const handleWatchTutorial = () => {
    console.log('Watch Tutorial clicked')
  }

  const handleQuickAction = (actionId) => {
    console.log('Quick action clicked:', actionId)
  }

  const handleGameFavorite = (gameId, isFavorited) => {
    console.log('Game favorited:', gameId, isFavorited)
  }

  const handlePrevious = () => {
    setCarouselIndex(Math.max(0, carouselIndex - 1))
  }

  const handleNext = () => {
    setCarouselIndex(Math.min(maxIndex, carouselIndex + 1))
  }

  return (
    <div className="flex flex-col gap-10 max-w-[1200px] mx-auto">
      {/* Hero Section */}
      <HeroSection
        title="Strategy Awaits: Master Catan Today"
        description="Join over 10,000 players in the ultimate classic strategy game. Build settlements, trade resources, and pave your way to victory."
        image={heroImage}
        rating={4.9}
        tag="Featured Game"
        onlineCount={10234}
        onPlayNow={handlePlayNow}
        onWatchTutorial={handleWatchTutorial}
      />

      {/* Quick Actions */}
      <QuickActions actions={quickActions} onActionClick={handleQuickAction} />

      {/* Popular Games */}
      <div className="flex flex-col gap-5">
        <SectionHeader title="Popular Games" viewAllLink="/browse" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {popularGames.map((game) => (
            <GameCard key={game.id} game={game} onFavorite={handleGameFavorite} />
          ))}
        </div>
      </div>

      {/* New Arrivals with Carousel */}
      <div className="flex flex-col gap-5 pb-10">
        <SectionHeader
          title="New Arrivals"
          showNavigation
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
        
        {/* Carousel Container */}
        <div className="relative overflow-hidden">
          <motion.div 
            className="flex gap-6"
            animate={{ x: -carouselIndex * (280 + 24) }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {newArrivals.map((game) => (
              <NewArrivalCard key={game.id} game={game} />
            ))}
          </motion.div>
        </div>

        {/* Carousel Dots */}
        <div className="flex justify-center gap-2 mt-2">
          {Array.from({ length: maxIndex + 1 }, (_, i) => (
            <button
              key={i}
              onClick={() => setCarouselIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === carouselIndex 
                  ? 'bg-gradient-to-r from-[#00f0ff] to-[#a855f7] w-6' 
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}