// Import custom hook to access authentication context
import {useAuthContext} from './useAuthContext'

// Export a custom hook called useLogout
export const useLogout = () => {
    // Get dispatch function from AuthContext to update authentication state
    const {dispatch} = useAuthContext()

    // Define logout function
    const logout = () => {
        // Remove user data from localStorage (clears saved login info)
        localStorage.removeItem('user')

        // Dispatch LOGOUT action to update AuthContext (sets user to null)
        dispatch({type: 'LOGOUT'})
    }

    // Return the logout function so components can use it
    return {logout}
}
