import { useState, useContext } from "react";
import axios from 'axios';

import { UserAuthContext } from "../context/UserAuthContext";

function useLogin() {

    let { userAuthDispatch } = useContext(UserAuthContext)

    let [error, setError] = useState(null);
    let [loading, setLoading] = useState(null);

    async function login(email, password) {
        setLoading(true);
        setError(null);

        axios.post('/api/user/login', { email, password })
            .then(response => {
                localStorage.setItem('user', JSON.stringify(response.data));

                userAuthDispatch({ type: 'LOGIN', payload: response.data });

                setLoading(null);
            })
            .catch(err => {
                if (err.response.status === 302) {
                    window.location.assign(err.response.data.url);
                } else {
                    setLoading(null);
                    setError(err.response.data.errorMsg);
                }
            })
    }

    return { login, error, loading };
}

export default useLogin;