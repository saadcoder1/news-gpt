import { useState } from "react";
import axios from 'axios';

function useSignup() {

    let [error, setError] = useState(null);
    let [loading, setLoading] = useState(null);

    async function signup(email, password) {
        setLoading(true);
        setError(null);

        axios.post('/api/user/signup', {email, password})
            .then(response => {
                window.location.assign(response.data.url);
            })
            .catch(err => {
                setLoading(false);
                setError(err.response.data.errorMsg)
            })
    }

    return { signup, error, loading };
}

export default useSignup;