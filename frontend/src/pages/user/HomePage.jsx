import { LayoutGrid, PlusCircle, Shuffle } from 'lucide-react'
import { GameCard, NewArrivalCard } from '@/components/Game'
import { HeroSection, QuickActions } from '@/components/Home'
import SectionHeader from '@/components/common/SectionHeader'

// Hero image for featured game
const heroImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6nScqmqkDA1m73ZB3NIoVYRn-NoVZhlNJ6nHG9PfYNu9htB7sIwq13rXhzRACpmWTVotZmL-bJXc11wxiETP5COG0Do-JqiTUHndRbDQ9_yIdOhsXxOZbyGrpxvBaQ442jGILlt7ODsA-E1sYMF7xoGFwMX6tyG1iJLemgwFfesLcyU_GXtdEo8fkDZaqqzyIibwLNVvNe7YDw7vflxVsUtVsL0dveXcWKhDJRmGmw9sI21nucjFIu75w23J1uoO9MYLQ78muDoix'

// Sample data - In production, this would come from API
const popularGames = [
  {
    id: 1,
    title: 'Monopoly Classic',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDA7vEIR_RPLJ-YS9YGou4QC8ktUwEWDbpBMcrZ3iMxUYoQpWRjw5YH_yf1-__8FYkpzxkmZFAxWkdiOY4Zft7x5_jGcvUOw_Tu6m1SFAHr05Z-RT21Dsc-xfan-JnLfC89NIt_cZTUx6ikFF_oFppVLTluEvuceyYkM0TVE24GIA9-grrgOBhGLq73GWFRcFURNUPMhn20XJ3e_V7iK7Cu97V7cloLtvm8e2AkFIR7LQO0L572Vm4bzNlfKGvpDcyH098NRfPwV1C2',
    rating: 4.5,
    players: '2-6 Players',
    duration: '60m+',
  },
  {
    id: 2,
    title: 'Chess Arena',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJG3iIs6S7sYzD2VxpjHBJmcchytJ3n7BArtH7Wep8scO_R5UaglCjVxh9SdRRb_ysfcGsxbkl-v5p7P1RlIfA39EW5E7m91i52bzoRcDGJgHnZcy4cjSQTpcX5UZ4MS3yLpOjJVEbXIx_GD2ht_j_SLMF0TCVEJRuzWs0JuFk4FMfQ9PqSMkwUIkGmO4g1VRGtZwJ_q1YR6WLCACcKwUCtJ0_A3580MgOaBHvSYjzm3xr-pGrVhSVwMbXLimCiRJwTlQe_ia86cNZ',
    rating: 4.8,
    players: '2 Players',
    duration: '15-30m',
  },
  {
    id: 3,
    title: 'Word Master',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6A2ruZqVGA-_JXC7lNl3RFQaMgk-bU9lDIZ2ywSru1XZrKfNmg-dcygzmHrTnrwqHm81JG527rADKfuKvmxVNvaX48L-KifLS9JcneaN2xRlP4x0OeS-BGUT329xiA66KINvSSw-O1WQOaaMzukFygfDVU9L0TWWcT05BxNQi9tQ989MFm_eIFSRzgp1sWNLll6u8227Xu4JdOGLuLdjp0MBvWFTY-edcU9BKT7w3P2ln1rcc0icfn_r4TSJ9k6XfWk32q5TNKvQd',
    rating: 4.2,
    players: '2-4 Players',
    duration: '45m',
  },
  {
    id: 4,
    title: 'Poker Night',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQY-9JY2r5FbqNjNrYHA1C7TryNl0EdBTBuF1l0WXYyCZuFKJ_n4RO95zDNp3FH6Up8U7-v4DCkY0jWHVUMMuKenwsb7VBNFeR7EpJ2N6g4pnHrAe5QGfybkMR0tStnUxmtPEuyarAwwvZiCAnEZNSWu2VaqA36Qur0_KpPbdrPrabqIvIqNCsPcZF0wSZhfhJz1pOUQsapTK6rakRa0xx_LQ9daEeS4xhd9OpwMG8YrZrxvmrWUnDi4qlb9R0lGSpY3RVMeVEL6Ug',
    rating: 4.7,
    players: '2-10 Players',
    duration: '30m+',
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
]

const quickActions = [
  {
    id: 1,
    title: 'Browse Library',
    icon: LayoutGrid,
    color: 'bg-blue-50 text-blue-500',
  },
  {
    id: 2,
    title: 'Create Custom Table',
    icon: PlusCircle,
    color: 'bg-green-50 text-green-600',
  },
  {
    id: 3,
    title: 'Join Random Lobby',
    icon: Shuffle,
    color: 'bg-purple-50 text-purple-600',
  },
]

export default function HomePage() {
  const handlePlayNow = () => {
    // TODO: Navigate to game or start game
    console.log('Play Now clicked')
  }

  const handleWatchTutorial = () => {
    // TODO: Open tutorial modal or navigate to tutorial
    console.log('Watch Tutorial clicked')
  }

  const handleQuickAction = (actionId) => {
    // TODO: Handle quick action based on actionId
    console.log('Quick action clicked:', actionId)
  }

  const handleGameFavorite = (gameId, isFavorited) => {
    // TODO: Save favorite to API
    console.log('Game favorited:', gameId, isFavorited)
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

      {/* New Arrivals */}
      <div className="flex flex-col gap-5 pb-10">
        <SectionHeader
          title="New Arrivals"
          showNavigation
          onPrevious={() => console.log('Previous')}
          onNext={() => console.log('Next')}
        />
        <div className="flex gap-6 overflow-x-auto pb-4">
          {newArrivals.map((game) => (
            <NewArrivalCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </div>
  )
}