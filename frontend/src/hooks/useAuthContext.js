// Import the AuthContext object from the context folder
import {AuthContext} from '../context/AuthContext'
// Import the useContext hook from React
import {useContext} from 'react'

// Define and export a custom hook called useAuthContext
export const useAuthContext = () => {
    // Get the current context value by calling useContext with AuthContext
    const context = useContext(AuthContext)

    // If context is not available (hook used outside provider), throw an error
    if (!context){
        throw Error('useAuthContext must be used inside an AuthContextProvider')
    }

    // Return the context value (contains user and dispatch function)
    return context
}
