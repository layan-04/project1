// Import React functions: createContext for context, useReducer for state management, useEffect for side effects
import {createContext, useReducer, useEffect} from 'react'

// Create a new context object for authentication
export const AuthContext = createContext()

// Define reducer function to handle authentication actions
export const authReducer = (state, action) => {
    // Check the type of action
    switch (action.type){
        // If action is LOGIN, set user to payload
        case 'LOGIN':
            return {user:action.payload}
        // If action is LOGOUT, set user to null
        case 'LOGOUT':
            return {user:null}
        // Default case: return current state unchanged
        default:
            return state
    }
}

// Define AuthContextProvider component to wrap app and provide auth state
export const AuthContextProvider = ({children}) => {
    // useReducer hook to manage auth state with authReducer
    const [state, dispatch] = useReducer(authReducer, {
        user:null // initial state: no user
    })

    // useEffect runs once after component mounts
    useEffect(() => {
        // Get user data from localStorage (if exists)
        const user = JSON.parse(localStorage.getItem('user'))

        // If user exists
        if(user) {
            // Extract token from user object
            const token = user.token
            // If token exists
            if (token) {
                // Decode token payload (base64) to get expiration time
                const { exp } = JSON.parse(atob(token.split('.')[1]))
                // Check if token is expired
                if (Date.now() >= exp * 1000) {
                    // If expired → clear localStorage and logout
                    localStorage.removeItem('user')
                    dispatch({ type: 'LOGOUT' })
                    return // Exit effect
                }
            }
            // If token still valid → dispatch LOGIN with user data
            dispatch({type:'LOGIN', payload:user})
        }
    }, []) // Empty dependency array → run only once

    // Log current auth state to console (for debugging)
    console.log('AuthContext state: ', state)

    // Return provider component to wrap children
    return(
        <AuthContext.Provider value={{...state, dispatch}}>
            {children} {/* Render child components inside provider */}
        </AuthContext.Provider>
    )
}
