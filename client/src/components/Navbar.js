import { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

import useLogout from '../hooks/useLogout';

function Navbar() {

    let { logout } = useLogout();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    function handleLogout() {
        logout();
        handleMenuClose();
    }

    return (
        <AppBar position="fixed" sx={{ backgroundColor: 'white', color: 'black' }}>
            <Toolbar>
                <Typography variant='h5' sx={{ flexGrow: 1, fontWeight: 500 }}>
                    Readme.
                </Typography>

                <IconButton color="primary" onClick={handleMenuOpen}>
                    <AccountCircle />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>

            </Toolbar>
        </AppBar >
    );
}

export default Navbar;
