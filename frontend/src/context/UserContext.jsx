import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
    const [profile, setProfile] = useState(null)
    const [preferences, setPreferences] = useState({
        notifications: true,
        soundEnabled: true,
        difficulty: 'medium',
    })
    const [stats, setStats] = useState({
        totalGamesPlayed: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        currentStreak: 0,
        bestStreak: 0,
        totalPlayTime: 0, // in minutes
    })
    const [friends, setFriends] = useState([])
    const [achievements, setAchievements] = useState([])

    // Initialize from localStorage
    useEffect(() => {
        const storedProfile = localStorage.getItem('userProfile')
        const storedPreferences = localStorage.getItem('userPreferences')
        const storedStats = localStorage.getItem('userStats')

        if (storedProfile) {
            setProfile(JSON.parse(storedProfile))
        }
        if (storedPreferences) {
            setPreferences(JSON.parse(storedPreferences))
        }
        if (storedStats) {
            setStats(JSON.parse(storedStats))
        }
    }, [])

    const updateProfile = (updates) => {
        const updatedProfile = { ...profile, ...updates }
        setProfile(updatedProfile)
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile))
        return updatedProfile
    }

    const updatePreferences = (updates) => {
        const updatedPreferences = { ...preferences, ...updates }
        setPreferences(updatedPreferences)
        localStorage.setItem('userPreferences', JSON.stringify(updatedPreferences))
        return updatedPreferences
    }

    const updateStats = (updates) => {
        const updatedStats = { ...stats, ...updates }
        setStats(updatedStats)
        localStorage.setItem('userStats', JSON.stringify(updatedStats))
        return updatedStats
    }

    const recordGameResult = (result) => {
        // result: { win: boolean, draw: boolean, gameType: string, duration: number }
        const newStats = { ...stats }

        newStats.totalGamesPlayed += 1
        newStats.totalPlayTime += result.duration || 0

        if (result.win) {
            newStats.wins += 1
            newStats.currentStreak += 1
            if (newStats.currentStreak > newStats.bestStreak) {
                newStats.bestStreak = newStats.currentStreak
            }
        } else if (result.draw) {
            newStats.draws += 1
            newStats.currentStreak = 0
        } else {
            newStats.losses += 1
            newStats.currentStreak = 0
        }

        updateStats(newStats)
        return newStats
    }

    const addFriend = (friendData) => {
        const newFriends = [...friends]
        const friendExists = newFriends.some((f) => f.id === friendData.id)

        if (!friendExists) {
            newFriends.push(friendData)
            setFriends(newFriends)
            localStorage.setItem('userFriends', JSON.stringify(newFriends))
            return true
        }
        return false
    }

    const removeFriend = (friendId) => {
        const newFriends = friends.filter((f) => f.id !== friendId)
        setFriends(newFriends)
        localStorage.setItem('userFriends', JSON.stringify(newFriends))
        return true
    }

    const unlockAchievement = (achievement) => {
        const achievementExists = achievements.some((a) => a.id === achievement.id)

        if (!achievementExists) {
            const newAchievements = [...achievements, { ...achievement, unlockedAt: new Date().toISOString() }]
            setAchievements(newAchievements)
            localStorage.setItem('userAchievements', JSON.stringify(newAchievements))
            return true
        }
        return false
    }

    const getStats = () => {
        const totalGames = stats.totalGamesPlayed || 0
        const winRate = totalGames > 0 ? ((stats.wins / totalGames) * 100).toFixed(2) : 0

        return {
            ...stats,
            winRate,
        }
    }

    const checkAchievements = () => {
        const unlockedList = []
        const gameStats = getStats()

        // Achievement: First Win
        if (gameStats.wins === 1) {
            unlockedList.push({
                id: 'first-win',
                name: 'First Victory',
                description: 'Win your first game',
                icon: '🏆',
            })
        }

        // Achievement: 10 Wins
        if (gameStats.wins === 10) {
            unlockedList.push({
                id: '10-wins',
                name: 'Victorious',
                description: 'Achieve 10 wins',
                icon: '⭐',
            })
        }

        // Achievement: 50 Games
        if (gameStats.totalGamesPlayed === 50) {
            unlockedList.push({
                id: '50-games',
                name: 'Dedicated Player',
                description: 'Play 50 games',
                icon: '🎮',
            })
        }

        // Achievement: 5 Win Streak
        if (gameStats.currentStreak === 5) {
            unlockedList.push({
                id: '5-streak',
                name: 'On Fire',
                description: 'Achieve 5 consecutive wins',
                icon: '🔥',
            })
        }

        // Unlock achievements
        unlockedList.forEach((achievement) => {
            unlockAchievement(achievement)
        })

        return unlockedList
    }

    return (
        <UserContext.Provider
            value={{
                profile,
                preferences,
                stats,
                friends,
                achievements,
                updateProfile,
                updatePreferences,
                updateStats,
                recordGameResult,
                addFriend,
                removeFriend,
                unlockAchievement,
                getStats,
                checkAchievements,
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error('useUser must be used within UserProvider')
    }
    return context
}
