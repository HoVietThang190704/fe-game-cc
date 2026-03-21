'use client'

import { Gamepad2, Users, Hash, Clock } from 'lucide-react'
import { useState } from 'react'

export default function MainPage() {
  const [playerStats] = useState({
    username: 'Player123',
    elo: 1250,
    winRate: 65.5,
    totalMatches: 142,
    wins: 93,
    losses: 49,
  })

  const gameModes = [
    {
      id: 1,
      title: 'Quick Match',
      description: 'Find random opponent',
      icon: Gamepad2,
      borderColor: 'from-cyan-400 to-cyan-500',
      textColor: 'text-cyan-400',
      glowColor: 'shadow-[0_0_20px_rgba(34,211,238,0.6)]',
      href: '/quick-match'
    },
    {
      id: 2,
      title: 'Create Room',
      description: 'Play with friends',
      icon: Users,
      borderColor: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-400',
      glowColor: 'shadow-[0_0_20px_rgba(59,130,246,0.6)]',
      href: '/create-room'
    },
    {
      id: 3,
      title: 'Join Room',
      description: 'Enter friend\'s room',
      icon: Hash,
      borderColor: 'from-lime-400 to-lime-500',
      textColor: 'text-lime-400',
      glowColor: 'shadow-[0_0_20px_rgba(132,204,22,0.6)]',
      href: '/join-room'
    },
    {
      id: 4,
      title: 'Match History',
      description: 'View past battles',
      icon: Clock,
      borderColor: 'from-orange-500 to-red-500',
      textColor: 'text-orange-400',
      glowColor: 'shadow-[0_0_20px_rgba(245,158,11,0.6)]',
      href: '/match-history'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-cyan-950 to-slate-950 p-4 md:p-6 relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(34, 211, 238, .05) 25%, rgba(34, 211, 238, .05) 26%, transparent 27%, transparent 74%, rgba(34, 211, 238, .05) 75%, rgba(34, 211, 238, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(34, 211, 238, .05) 25%, rgba(34, 211, 238, .05) 26%, transparent 27%, transparent 74%, rgba(34, 211, 238, .05) 75%, rgba(34, 211, 238, .05) 76%, transparent 77%, transparent)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Header */}
      <header className="max-w-7xl mx-auto mb-12 relative z-10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500 flex items-center justify-center border border-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.8)]">
              <span className="text-slate-950 font-bold text-xl">⚡</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-cyan-400" style={{textShadow: '0 0 10px rgba(34, 211, 238, 0.8), 0 0 20px rgba(34, 211, 238, 0.5)', fontFamily: 'var(--font-orbitron)', letterSpacing: '0.15em'}}>
              MINESWEEPER PvP
            </h1>
          </div>
          <div className="flex gap-2 md:gap-4">
            <button className="px-3 md:px-4 py-2 rounded-lg bg-slate-800/50 text-cyan-400 font-semibold border border-cyan-400/50 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] transition text-sm md:text-base" style={{fontFamily: 'var(--font-space-mono)'}}>
              🏆 LEADERBOARD
            </button>
            <button className="p-2 rounded-lg bg-slate-800/50 text-cyan-400 border border-cyan-400/30 hover:border-cyan-400/80 hover:shadow-[0_0_10px_rgba(34,211,238,0.5)] transition">
              🔔
            </button>
            <button className="p-2 rounded-lg bg-slate-800/50 text-cyan-400 border border-cyan-400/30 hover:border-cyan-400/80 hover:shadow-[0_0_10px_rgba(34,211,238,0.5)] transition">
              ⚙️
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Panel - Player Info */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-cyan-400/30 hover:border-cyan-400/60 transition space-y-6 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
              {/* Profile */}
              <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center border border-cyan-300/50 relative shadow-[0_0_25px_rgba(34,211,238,0.6)]">
                  <span className="text-4xl">👾</span>
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition" style={{background: 'radial-gradient(circle at 30% 30%, rgba(34,211,238,0.2), transparent)'}}></div>
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-cyan-400" style={{fontFamily: 'var(--font-space-mono)'}}>{playerStats.username}</h2>
                  <p className="text-lime-400 font-bold text-base md:text-lg">⚔️ {playerStats.elo} ELO</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-lime-400/40 backdrop-blur hover:border-lime-400/80 transition">
                  <p className="text-lime-400 font-bold text-lg md:text-xl">{playerStats.winRate.toFixed(1)}%</p>
                  <p className="text-cyan-300 text-xs md:text-sm" style={{fontFamily: 'var(--font-space-mono)'}}>WIN RATE</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-blue-400/40 backdrop-blur hover:border-blue-400/80 transition">
                  <p className="text-blue-400 font-bold text-lg md:text-xl">{playerStats.totalMatches}</p>
                  <p className="text-cyan-300 text-xs md:text-sm" style={{fontFamily: 'var(--font-space-mono)'}}>MATCHES</p>
                </div>
              </div>

              {/* View Profile Button */}
              <button className="w-full py-3 rounded-lg bg-slate-800/50 text-cyan-400 font-bold hover:text-cyan-300 transition border-2 border-cyan-400/60 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.7)] text-sm md:text-base" style={{fontFamily: 'var(--font-space-mono)'}}>
                VIEW PROFILE
              </button>

              {/* Statistics */}
              <div className="bg-slate-800/30 rounded-lg p-4 border border-cyan-400/20 space-y-3">
                <h3 className="text-cyan-400 font-bold text-sm md:text-base" style={{fontFamily: 'var(--font-orbitron)', letterSpacing: '0.1em'}}>STATISTICS</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-cyan-300">Wins:</span>
                  <span className="text-lime-400 font-bold">{playerStats.wins}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-cyan-300">Losses:</span>
                  <span className="text-orange-400 font-bold">{playerStats.losses}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Game Modes */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-cyan-400 mb-6" style={{fontFamily: 'var(--font-orbitron)', textShadow: '0 0 10px rgba(34, 211, 238, 0.6)', letterSpacing: '0.1em'}}>COMMAND CENTER</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {gameModes.map((mode) => {
                  const IconComponent = mode.icon
                  return (
                    <a
                      key={mode.id}
                      href={mode.href}
                      className="group relative rounded-2xl p-6 md:p-8 text-white font-semibold text-base md:text-lg cursor-pointer transition transform duration-300 hover:scale-105 border-2 backdrop-blur-sm bg-slate-900/40"
                      style={{
                        borderImage: `linear-gradient(135deg, ${
                          mode.id === 1 ? 'rgb(34, 211, 238), rgb(6, 182, 212)' :
                          mode.id === 2 ? 'rgb(59, 130, 246), rgb(147, 197, 253)' :
                          mode.id === 3 ? 'rgb(132, 204, 22), rgb(101, 163, 13)' :
                          'rgb(245, 158, 11), rgb(239, 68, 68)'
                        }) 1`,
                        boxShadow: mode.glowColor
                      }}
                    >
                      <div className="flex flex-col items-center justify-center gap-3 md:gap-4 h-full">
                        <IconComponent size={40} className="md:w-12 md:h-12 group-hover:scale-125 group-hover:rotate-6 transition" style={{color: 
                          mode.id === 1 ? 'rgb(34, 211, 238)' :
                          mode.id === 2 ? 'rgb(59, 130, 246)' :
                          mode.id === 3 ? 'rgb(132, 204, 22)' :
                          'rgb(245, 158, 11)'
                        }} />
                        <div className="text-center">
                          <h3 className="font-black text-base md:text-xl tracking-wider" style={{color: 
                            mode.id === 1 ? 'rgb(34, 211, 238)' :
                            mode.id === 2 ? 'rgb(59, 130, 246)' :
                            mode.id === 3 ? 'rgb(132, 204, 22)' :
                            'rgb(245, 158, 11)',
                            textShadow: `0 0 10px ${
                              mode.id === 1 ? 'rgba(34, 211, 238, 0.8)' :
                              mode.id === 2 ? 'rgba(59, 130, 246, 0.8)' :
                              mode.id === 3 ? 'rgba(132, 204, 22, 0.8)' :
                              'rgba(245, 158, 11, 0.8)'
                            }`,
                            fontFamily: 'var(--font-orbitron)',
                            letterSpacing: '0.05em'
                          }}>
                            {mode.title.toUpperCase()}
                          </h3>
                          <p className="text-xs md:text-sm text-cyan-300/70 mt-1 group-hover:text-cyan-300 transition" style={{fontFamily: 'var(--font-space-mono)', letterSpacing: '0.02em'}}>{mode.description}</p>
                        </div>
                      </div>
                      {/* Neon corner effect */}
                      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 opacity-0 group-hover:opacity-100 transition" style={{borderColor: 
                        mode.id === 1 ? 'rgb(34, 211, 238)' :
                        mode.id === 2 ? 'rgb(59, 130, 246)' :
                        mode.id === 3 ? 'rgb(132, 204, 22)' :
                        'rgb(245, 158, 11)'
                      }}></div>
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 opacity-0 group-hover:opacity-100 transition" style={{borderColor: 
                        mode.id === 1 ? 'rgb(34, 211, 238)' :
                        mode.id === 2 ? 'rgb(59, 130, 246)' :
                        mode.id === 3 ? 'rgb(132, 204, 22)' :
                        'rgb(245, 158, 11)'
                      }}></div>
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
