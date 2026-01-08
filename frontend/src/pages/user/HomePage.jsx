import { Card } from 'antd'

export default function HomePage() {
  // Placeholder cards data
  const cards = [
    { id: 1, title: 'Game 1', description: 'Description for game 1' },
    { id: 2, title: 'Game 2', description: 'Description for game 2' },
    { id: 3, title: 'Game 3', description: 'Description for game 3' },
    { id: 4, title: 'Game 4', description: 'Description for game 4' },
    { id: 5, title: 'Game 5', description: 'Description for game 5' },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Welcome to BoardGameHub</h2>

      <div className="flex flex-col gap-6">
        {cards.map((card) => (
          <Card
            key={card.id}
            hoverable
            className="rounded-2xl shadow-md border border-slate-100 overflow-hidden"
            styles={{ body: { padding: 0 } }}
          >
            <div className="flex flex-col md:flex-row">
              {/* Placeholder image area */}
              <div className="w-full md:w-80 h-48 md:h-auto bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shrink-0">
                <div className="text-center text-slate-400">
                  <div className="w-20 h-20 rounded-full bg-white/60 mx-auto mb-3 flex items-center justify-center shadow-inner">
                    <span className="text-3xl font-bold text-slate-300">{card.id}</span>
                  </div>
                  <p className="text-sm font-medium">Game Image</p>
                </div>
              </div>

              {/* Card content */}
              <div className="flex-1 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 rounded-md bg-blue-100 text-blue-600 text-xs font-semibold">
                    Featured Game
                  </span>
                  <span className="text-amber-500 text-sm">★ 4.9</span>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-2">{card.title}</h3>
                <p className="text-slate-500 mb-4 text-sm leading-relaxed">
                  {card.description}. Join thousands of players in this exciting strategy game.
                  Build your empire, trade resources, and pave your way to victory.
                </p>

                <div className="flex items-center gap-3">
                  <button className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm transition-colors">
                    Play Now
                  </button>
                  <button className="px-5 py-2.5 border border-slate-200 hover:border-slate-300 text-slate-600 rounded-lg font-medium text-sm transition-colors">
                    Watch Tutorial
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}