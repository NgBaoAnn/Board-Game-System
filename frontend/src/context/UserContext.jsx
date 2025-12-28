import { createContext, useContext } from 'react'

// Empty user context placeholder
const UserContext = createContext({})

export const UserProvider = ({ children }) => {
    return <UserContext.Provider value={{}}>{children}</UserContext.Provider>
}

export const useUser = () => {
    return useContext(UserContext)
}
