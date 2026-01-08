import { createContext, useContext } from 'react'

// Empty game context placeholder
const GameContext = createContext({})

export const GameProvider = ({ children }) => {
    return <GameContext.Provider value={{}}>{children}</GameContext.Provider>
}

export const useGame = () => {
    return useContext(GameContext)
}
