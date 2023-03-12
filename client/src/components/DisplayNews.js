import { useEffect, useState } from "react";
import useGetNews from "../hooks/useGetNews";
import { Box, CircularProgress } from "@mui/material";

import NewsCards from "./NewsCards";

const DisplayNews = ({ category }) => {

    let [content, setContent] = useState(null);
    let { getNews, error, loading } = useGetNews();


    useEffect(() => {

        let controller = new AbortController();
        setContent(null);

        async function fetchNews() {
            if (category === 'home') {
                let news = await getNews({ type: 'home', payload: null, signal: controller.signal });
                setContent(news);
            }
            else {
                let news = await getNews({ type: 'category', payload: category, signal: controller.signal });
                setContent(news);
            }
        }

        fetchNews();

        return () => controller.abort();

    }, [category])

    return (
        <Box sx={{ paddingInline: 3 }} >
            {content && (
                <NewsCards allNews={content} />
            )}

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 5 }}>
                    <CircularProgress />
                </Box>
            )}


            <h2>{error}</h2>
        </Box>
    );
}

export default DisplayNews;