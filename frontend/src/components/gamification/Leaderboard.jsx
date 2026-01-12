import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Crown, TrendingUp, User } from 'lucide-react';

const mockLeaderboardData = [
  { rank: 1, name: 'CyberNinja', points: 2850, events: 12, badges: 8, avatar: '🥷' },
  { rank: 2, name: 'HackMaster', points: 2640, events: 11, badges: 7, avatar: '👨‍💻' },
  { rank: 3, name: 'SecurityPro', points: 2420, events: 10, badges: 6, avatar: '🛡️' },
  { rank: 4, name: 'CodeBreaker', points: 2180, events: 9, badges: 6, avatar: '🔓' },
  { rank: 5, name: 'ByteWarrior', points: 1950, events: 8, badges: 5, avatar: '⚔️' },
  { rank: 6, name: 'NetGuardian', points: 1720, events: 7, badges: 5, avatar: '🌐' },
  { rank: 7, name: 'CryptoKing', points: 1580, events: 7, badges: 4, avatar: '👑' },
  { rank: 8, name: 'BugHunter', points: 1340, events: 6, badges: 4, avatar: '🐛' },
  { rank: 9, name: 'DataMiner', points: 1120, events: 5, badges: 3, avatar: '⛏️' },
  { rank: 10, name: 'ScriptKiddie', points: 980, events: 4, badges: 3, avatar: '📜' },
];

const Leaderboard = ({ currentUser = null }) => {
  const [timeFilter, setTimeFilter] = useState('all'); // all, month, week

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 3:
        return <Award className="w-5 h-5 text-orange-400" />;
      default:
        return <span className="text-sm font-mono text-gray-500">#{rank}</span>;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return 'border-yellow-500/50 bg-yellow-500/10';
      case 2:
        return 'border-gray-300/50 bg-gray-300/10';
      case 3:
        return 'border-orange-500/50 bg-orange-500/10';
      default:
        return 'border-white/10 bg-white/5';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-white font-display uppercase">
            Leaderboard
          </h2>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-primary/50 to-transparent" />
        </div>

        {/* Time Filter */}
        <div className="flex gap-2">
          {['all', 'month', 'week'].map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-3 py-1 rounded text-xs font-mono uppercase transition-all ${
                timeFilter === filter
                  ? 'bg-primary text-black'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Current User Stats */}
      {currentUser && (
        <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{currentUser.avatar}</div>
              <div>
                <p className="text-sm text-gray-400 font-mono">Your Rank</p>
                <p className="text-lg font-bold text-white font-mono">
                  #{currentUser.rank}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400 font-mono">Points</p>
              <p className="text-lg font-bold text-primary font-mono">
                {currentUser.points} XP
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="space-y-2">
        {mockLeaderboardData.map((user, index) => (
          <motion.div
            key={user.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`relative p-4 rounded-lg border ${getRankColor(user.rank)} transition-all hover:scale-[1.02] cursor-pointer group`}
          >
            {/* Corner Accents for Top 3 */}
            {user.rank <= 3 && (
              <>
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary/50" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary/50" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary/50" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary/50" />
              </>
            )}

            <div className="flex items-center justify-between">
              {/* Left: Rank & User */}
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10">
                  {getRankIcon(user.rank)}
                </div>
                <div className="text-2xl">{user.avatar}</div>
                <div>
                  <p className="text-white font-bold font-mono">{user.name}</p>
                  <p className="text-xs text-gray-500 font-mono">
                    {user.events} events • {user.badges} badges
                  </p>
                </div>
              </div>

              {/* Right: Points */}
              <div className="text-right">
                <p className="text-lg font-bold text-primary font-mono">
                  {user.points}
                </p>
                <p className="text-xs text-gray-500 font-mono">XP</p>
              </div>
            </div>

            {/* Hover Glow */}
            {user.rank <= 3 && (
              <div className="absolute inset-0 bg-primary/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-lg -z-10" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white/5 border border-white/10 rounded text-center">
          <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <p className="text-xs text-gray-400 font-mono">Avg Growth</p>
          <p className="text-lg font-bold text-white font-mono">+12%</p>
        </div>
        <div className="p-4 bg-white/5 border border-white/10 rounded text-center">
          <User className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <p className="text-xs text-gray-400 font-mono">Total Users</p>
          <p className="text-lg font-bold text-white font-mono">247</p>
        </div>
        <div className="p-4 bg-white/5 border border-white/10 rounded text-center">
          <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <p className="text-xs text-gray-400 font-mono">Top Score</p>
          <p className="text-lg font-bold text-white font-mono">2850</p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
