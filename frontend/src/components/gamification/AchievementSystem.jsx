import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Shield, Zap, Star, Target, Crown, Medal } from 'lucide-react';

const achievementData = [
  { id: 1, name: 'First Event', description: 'Attended your first ASTRA event', icon: Star, color: 'text-blue-400', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/30' },
  { id: 2, name: 'CTF Master', description: 'Won a CTF competition', icon: Trophy, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/30' },
  { id: 3, name: 'Security Expert', description: 'Completed 5 security workshops', icon: Shield, color: 'text-green-400', bgColor: 'bg-green-500/20', borderColor: 'border-green-500/30' },
  { id: 4, name: 'Speed Demon', description: 'Solved challenge in under 10 minutes', icon: Zap, color: 'text-purple-400', bgColor: 'bg-purple-500/20', borderColor: 'border-purple-500/30' },
  { id: 5, name: 'Team Player', description: 'Participated in 3 team events', icon: Award, color: 'text-cyan-400', bgColor: 'bg-cyan-500/20', borderColor: 'border-cyan-500/30' },
  { id: 6, name: 'Sharpshooter', description: '100% accuracy in a challenge', icon: Target, color: 'text-red-400', bgColor: 'bg-red-500/20', borderColor: 'border-red-500/30' },
  { id: 7, name: 'Elite Hacker', description: 'Reached top 10 in leaderboard', icon: Crown, color: 'text-orange-400', bgColor: 'bg-orange-500/20', borderColor: 'border-orange-500/30' },
  { id: 8, name: 'Veteran', description: 'Attended 10+ events', icon: Medal, color: 'text-pink-400', bgColor: 'bg-pink-500/20', borderColor: 'border-pink-500/30' },
];

const AchievementBadge = ({ achievement, unlocked = false, index }) => {
  const Icon = achievement.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`relative group cursor-pointer ${unlocked ? '' : 'grayscale opacity-50'}`}
    >
      <div className={`relative p-4 rounded-lg border ${unlocked ? achievement.borderColor : 'border-white/10'} ${unlocked ? achievement.bgColor : 'bg-white/5'} transition-all hover:scale-105`}>
        {/* Corner Accents */}
        {unlocked && (
          <>
            <div className={`absolute top-0 left-0 w-3 h-3 border-t border-l ${achievement.borderColor}`} />
            <div className={`absolute top-0 right-0 w-3 h-3 border-t border-r ${achievement.borderColor}`} />
            <div className={`absolute bottom-0 left-0 w-3 h-3 border-b border-l ${achievement.borderColor}`} />
            <div className={`absolute bottom-0 right-0 w-3 h-3 border-b border-r ${achievement.borderColor}`} />
          </>
        )}

        <div className="flex flex-col items-center text-center gap-2">
          <Icon className={`w-8 h-8 ${unlocked ? achievement.color : 'text-gray-600'}`} />
          <h3 className={`text-sm font-bold font-mono uppercase ${unlocked ? 'text-white' : 'text-gray-600'}`}>
            {achievement.name}
          </h3>
          <p className={`text-xs ${unlocked ? 'text-gray-400' : 'text-gray-700'}`}>
            {achievement.description}
          </p>
        </div>

        {/* Unlock Glow */}
        {unlocked && (
          <div className={`absolute inset-0 ${achievement.bgColor} blur-xl opacity-0 group-hover:opacity-50 transition-opacity rounded-lg -z-10`} />
        )}
      </div>

      {/* Lock Overlay */}
      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl">🔒</div>
        </div>
      )}
    </motion.div>
  );
};

const AchievementSystem = ({ userAchievements = [] }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold text-white font-display uppercase">
          Achievements
        </h2>
        <div className="flex-1 h-[1px] bg-gradient-to-r from-primary/50 to-transparent" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {achievementData.map((achievement, index) => (
          <AchievementBadge
            key={achievement.id}
            achievement={achievement}
            unlocked={userAchievements.includes(achievement.id)}
            index={index}
          />
        ))}
      </div>

      <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded">
        <div>
          <p className="text-sm text-gray-400 font-mono">Progress</p>
          <p className="text-lg font-bold text-white font-mono">
            {userAchievements.length}/{achievementData.length} Unlocked
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400 font-mono">Total Points</p>
          <p className="text-lg font-bold text-primary font-mono">
            {userAchievements.length * 100} XP
          </p>
        </div>
      </div>
    </div>
  );
};

export default AchievementSystem;
