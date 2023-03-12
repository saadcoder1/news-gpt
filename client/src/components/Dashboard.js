import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";

import newsCategories from "../newsCategories";

// components
import DisplayNews from "./DisplayNews";
import Navbar from './Navbar';


const Dashboard = () => {
    const [selectedCategory, setSelectedCategory] = useState('home');

    const handleChange = (event, newValue) => {
        setSelectedCategory(newValue);
    };

    return (
        <Box>
            <Navbar />

            <Box sx={{ width: '100%', marginTop: 9, marginBottom: 2 }}>
                <Tabs
                    value={selectedCategory}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                    aria-label="category tabs"
                >
                    {newsCategories.map((category, index) => (
                        <Tab label={category} value={category} key={index} />
                    ))}
                </Tabs>
            </Box>

            <DisplayNews category={selectedCategory} />

        </Box>

    );
}

export default Dashboard;