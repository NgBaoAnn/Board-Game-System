import { createContext, useContext, useState } from 'react'

const BoardContext = createContext()

export const BoardProvider = ({ children }) => {
    
    return (
        <BoardContext.Provider>
            {children}
        </BoardContext.Provider>
    )
}

export const useBoard = () => {
    return context
}
