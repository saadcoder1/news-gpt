import { InputAdornment, Stack, TextField, Typography, Box, Button, Alert } from "@mui/material";
import { useState } from "react";

import useLogin from "../hooks/useLogin";
import { Link } from "react-router-dom";

// importing icons
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';


const Login = () => {

    let { login, error, loading } = useLogin();

    let [passwordVisibile, setPasswordVisibility] = useState(false);
    function handleVisiblity() {
        setPasswordVisibility(!passwordVisibile);
    }

    // form controlled inputs
    let [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    function submitLoginForm(event) {
        event.preventDefault();

        login(formData.email, formData.password);
    }

    return (
        <Box>

            <Typography color='primary' textAlign='center' variant="h3" mt={5}>Readme.</Typography>

            <Typography textAlign='center' variant="h4" mt={4} mb={1}>Welcome back</Typography>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 5 }}>
                <Typography>
                    Dont have an account?
                </Typography>
                <Typography><Link to='/signup'>Sign Up</Link></Typography>
            </Box>

            <form onSubmit={submitLoginForm}>
                <Stack spacing={3} alignItems="center">
                    {/* email */}
                    <TextField type="email" label="Email" variant="outlined" sx={{ width: 280 }} required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />

                    {/* password */}
                    <TextField type={passwordVisibile ? "text" : "password"} label="Password" required InputProps={{
                        endAdornment:
                            <InputAdornment position="end" onClick={handleVisiblity} sx={{ cursor: "pointer" }}>
                                {passwordVisibile ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </InputAdornment>
                    }} sx={{ width: 280 }} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />

                    <Button disabled={loading} type="submit" variant="contained" size="large">Submit</Button>
                </Stack>
            </form>


            {/* error display */}
            {error && (
                <Box mt={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Alert severity="error">
                        {error}
                    </Alert>
                </Box>
            )}

        </Box>


    );
}

export default Login;