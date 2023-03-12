import { useState, useContext } from "react";
import { UserAuthContext } from "../context/UserAuthContext";
import axios from "axios";


function useGetNews() {

    let { userAuthState } = useContext(UserAuthContext);

    let [error, setError] = useState(null);
    let [loading, setLoading] = useState(null);

    async function getNews(action) {

        setLoading(true);
        setError(null);

        if (action.type === 'home') {
            try {
                let response = await axios.post('/api/news', {}, {
                    signal: action.signal,
                    headers: {
                        'Authorization': `Bearer ${userAuthState.user.token}`
                    }
                });

                setLoading(false);
                return response.data.results;
            } catch (err) {
                // if the error is not an error due to aborting the fetch request
                if (err.name != 'CanceledError') {
                    setLoading(false);
                    setError(err.response.data.errMessage);
                    return null;
                }
            }
        }

        else if (action.type === 'category') {
            try {
                let category = action.payload;
                let response = await axios.post('/api/news/categories', { category }, {
                    signal: action.signal,
                    headers: {
                        'Authorization': `Bearer ${userAuthState.user.token}`
                    }
                });

                setLoading(false);
                return response.data.results;

            } catch (err) {
                // if the error is not an error due to aborting the fetch request
                if (err.name != 'CanceledError') {
                    setLoading(false);
                    setError(err.response.data.errMessage);
                    return null;
                }
            }
        }

    }

    return { getNews, loading, error };
}

export default useGetNews;