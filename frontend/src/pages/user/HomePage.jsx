import { useState } from 'react'
import { Users, Clock, Zap, Crown, Gamepad2 } from 'lucide-react'
import GameCard from '@/components/Game/GameCard'
import NewArrivalCard from '@/components/Game/NewArrivalCard'
import HeroSection from '@/components/Home/HeroSection'
import SectionHeader from '@/components/common/SectionHeader'

const heroImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6nScqmqkDA1m73ZB3NIoVYRn-NoVZhlNJ6nHG9PfYNu9htB7sIwq13rXhzRACpmWTVotZmL-bJXc11wxiETP5COG0Do-JqiTUHndRbDQ9_yIdOhsXxOZbyGrpxvBaQ442jGILlt7ODsA-E1sYMF7xoGFwMX6tyG1iJLemgwFfesLcyU_GXtdEo8fkDZaqqzyIibwLNVvNe7YDw7vflxVsUtVsL0dveXcWKhDJRmGmw9sI21nucjFIu75w23J1uoO9MYLQ78muDoix'

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

const liveGames = [
  {
    id: 1,
    gameName: 'Monopoly Classic',
    hostName: 'DragonMaster',
    hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dragon',
    players: 3,
    maxPlayers: 6,
    status: 'waiting',
    timeElapsed: null,
    isRanked: true,
    gameImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDA7vEIR_RPLJ-YS9YGou4QC8ktUwEWDbpBMcrZ3iMxUYoQpWRjw5YH_yf1-__8FYkpzxkmZFAxWkdiOY4Zft7x5_jGcvUOw_Tu6m1SFAHr05Z-RT21Dsc-xfan-JnLfC89NIt_cZTUx6ikFF_oFppVLTluEvuceyYkM0TVE24GIA9-grrgOBhGLq73GWFRcFURNUPMhn20XJ3e_V7iK7Cu97V7cloLtvm8e2AkFIR7LQO0L572Vm4bzNlfKGvpDcyH098NRfPwV1C2',
  },
  {
    id: 2,
    gameName: 'Chess Arena',
    hostName: 'GrandMaster99',
    hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chess',
    players: 1,
    maxPlayers: 2,
    status: 'waiting',
    timeElapsed: null,
    isRanked: true,
    gameImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJG3iIs6S7sYzD2VxpjHBJmcchytJ3n7BArtH7Wep8scO_R5UaglCjVxh9SdRRb_ysfcGsxbkl-v5p7P1RlIfA39EW5E7m91i52bzoRcDGJgHnZcy4cjSQTpcX5UZ4MS3yLpOjJVEbXIx_GD2ht_j_SLMF0TCVEJRuzWs0JuFk4FMfQ9PqSMkwUIkGmO4g1VRGtZwJ_q1YR6WLCACcKwUCtJ0_A3580MgOaBHvSYjzm3xr-pGrVhSVwMbXLimCiRJwTlQe_ia86cNZ',
  },
  {
    id: 3,
    gameName: 'Poker Night',
    hostName: 'CardShark',
    hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=poker',
    players: 5,
    maxPlayers: 10,
    status: 'in-progress',
    timeElapsed: '12:34',
    isRanked: false,
    gameImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQY-9JY2r5FbqNjNrYHA1C7TryNl0EdBTBuF1l0WXYyCZuFKJ_n4RO95zDNp3FH6Up8U7-v4DCkY0jWHVUMMuKenwsb7VBNFeR7EpJ2N6g4pnHrAe5QGfybkMR0tStnUxmtPEuyarAwwvZiCAnEZNSWu2VaqA36Qur0_KpPbdrPrabqIvIqNCsPcZF0wSZhfhJz1pOUQsapTK6rakRa0xx_LQ9daEeS4xhd9OpwMG8YrZrxvmrWUnDi4qlb9R0lGSpY3RVMeVEL6Ug',
  },
  {
    id: 4,
    gameName: 'Word Master',
    hostName: 'WordWizard',
    hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=word',
    players: 2,
    maxPlayers: 4,
    status: 'waiting',
    timeElapsed: null,
    isRanked: false,
    gameImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6A2ruZqVGA-_JXC7lNl3RFQaMgk-bU9lDIZ2ywSru1XZrKfNmg-dcygzmHrTnrwqHm81JG527rADKfuKvmxVNvaX48L-KifLS9JcneaN2xRlP4x0OeS-BGUT329xiA66KINvSSw-O1WQOaaMzukFygfDVU9L0TWWcT05BxNQi9tQ989MFm_eIFSRzgp1sWNLll6u8227Xu4JdOGLuLdjp0MBvWFTY-edcU9BKT7w3P2ln1rcc0icfn_r4TSJ9k6XfWk32q5TNKvQd',
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

  const handleJoinGame = (gameId) => {
    console.log('Join game clicked:', gameId)
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

      
      <div className="flex flex-col gap-5">
        <SectionHeader 
          title="Live Games" 
          viewAllLink="/lobbies"
          badge={
            <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              {liveGames.length} Active
            </span>
          }
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {liveGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 border border-white/10 hover:border-[#00f0ff]/50 transition-all duration-300"
            >
              
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                <img 
                  src={game.gameImage} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e] via-[#1a1a2e]/80 to-transparent" />
              </div>
              
              <div className="relative p-4 flex items-center gap-4">
                
                <div className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-white/20">
                  <img 
                    src={game.gameImage} 
                    alt={game.gameName}
                    className="w-full h-full object-cover"
                  />
                  {game.isRanked && (
                    <div className="absolute top-0 right-0 p-0.5 bg-yellow-500 rounded-bl">
                      <Crown className="w-3 h-3 text-black" />
                    </div>
                  )}
                </div>
                
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-white truncate">{game.gameName}</h4>
                    {game.status === 'waiting' ? (
                      <span className="flex-shrink-0 px-2 py-0.5 text-[10px] font-medium bg-[#00f0ff]/20 text-[#00f0ff] rounded-full">
                        WAITING
                      </span>
                    ) : (
                      <span className="flex-shrink-0 px-2 py-0.5 text-[10px] font-medium bg-orange-500/20 text-orange-400 rounded-full flex items-center gap-1">
                        <Gamepad2 className="w-3 h-3" />
                        LIVE
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    
                    <div className="flex items-center gap-1.5">
                      <img 
                        src={game.hostAvatar} 
                        alt={game.hostName}
                        className="w-5 h-5 rounded-full border border-white/20"
                      />
                      <span className="truncate max-w-[80px]">{game.hostName}</span>
                    </div>
                    
                    
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{game.players}/{game.maxPlayers}</span>
                    </div>
                    
                    
                    {game.timeElapsed && (
                      <div className="flex items-center gap-1 text-orange-400">
                        <Clock className="w-4 h-4" />
                        <span>{game.timeElapsed}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                
                <button
                  onClick={() => handleJoinGame(game.id)}
                  disabled={game.status === 'in-progress'}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                    game.status === 'waiting'
                      ? 'bg-gradient-to-r from-[#00f0ff] to-[#a855f7] text-black hover:shadow-lg hover:shadow-[#00f0ff]/25 hover:scale-105'
                      : 'bg-white/10 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {game.status === 'waiting' ? (
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4" />
                      Join
                    </span>
                  ) : (
                    'Spectate'
                  )}
                </button>
              </div>
              
              
              <div className="relative px-4 pb-3">
                <div className="flex gap-1">
                  {Array.from({ length: game.maxPlayers }, (_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        i < game.players
                          ? 'bg-gradient-to-r from-[#00f0ff] to-[#a855f7]'
                          : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      
      <div className="flex flex-col gap-5">
        <SectionHeader title="Popular Games" viewAllLink="/browse" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {popularGames.map((game) => (
            <GameCard key={game.id} game={game} onFavorite={handleGameFavorite} />
          ))}
        </div>
      </div>

      
      <div className="flex flex-col gap-5 pb-10">
        <SectionHeader
          title="New Arrivals"
          showNavigation
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
        
        
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