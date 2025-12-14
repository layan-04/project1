// Import useState hook from React for managing local state
import {useState} from 'react'
// Import custom hook to access authentication context
import {useAuthContext} from './useAuthContext'

// Export a custom hook called useLogin
export const useLogin = () => {
    // State to store error messages (initially null)
    const [error, setError] = useState(null)
    // State to track loading status (initially null)
    const [isLoading, setIsLoading] = useState(null)
    // Get dispatch function from AuthContext to update auth state
    const {dispatch} = useAuthContext()

    // Define login function that takes email and password
    const login = async (email, password) => {
        // Set loading state to true when request starts
        setIsLoading(true)
        // Clear any previous error
        setError(null)

        // Send POST request to backend login endpoint
        const response = await fetch('https://project1-3-ow0y.onrender.com/api/user/login', {
            method: 'POST', // HTTP method
            headers: {'Content-Type': 'application/json'}, // Send JSON data
            body: JSON.stringify({email, password}) // Request body with email and password
        })
        // Parse response JSON
        const json = await response.json()
        // Log response for debugging
        console.log(json);

        // If response is not OK (error from backend)
        if (!response.ok) {
            // Error - show error to user
            setError(json.error); // Save error message in state
            setIsLoading(false);  // Stop loading
        } else {
            // Success - user logged in
            // Save user data in localStorage so it persists
            localStorage.setItem('user', JSON.stringify(json));
            // Dispatch LOGIN action to update AuthContext with user data
            dispatch({ type: 'LOGIN', payload: json });
            // Stop loading
            setIsLoading(false);
        }
    }

    // Return login function, loading state, and error state
    return {login, isLoading, error}
}
