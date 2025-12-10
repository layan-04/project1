import {useState} from 'react'
import {useAuthContext} from './useAuthContext'

export const useLogin = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const {dispatch} = useAuthContext()

    const login = async (email, password) => {
        setIsLoading(true)
        setError(null)

        const response = await fetch('https://project1-3-ow0y.onrender.com/api/user/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        })
        const json = await response.json()
        console.log(json);

        if (!response.ok) {
            //Error - show error to user
            setError(json.error); // or console.log(json.error)
            setIsLoading(false);
        } else {
            //Success - user logged in
            localStorage.setItem('user', JSON.stringify(json));
            dispatch({ type: 'LOGIN', payload: json });
            setIsLoading(false);
        }
    }

    return {login, isLoading, error}
}