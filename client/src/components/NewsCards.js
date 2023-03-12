import { useContext, useState } from 'react';
import { UserAuthContext } from '../context/UserAuthContext';

import { Box, Card, CardContent, CardMedia, Typography, Grid, Button, CardActions, Backdrop, Modal, Fade, IconButton, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { formatDistanceToNow } from 'date-fns';

import axios from 'axios';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
        xs: '70%',
        sm: '60%',
        md: '50%',
        lg: '40%'
    },
    height: '80vh',
    bgcolor: 'background.paper',
    border: `2px solid`,
    borderColor: 'primary.main',
    borderRadius: 3,
    boxShadow: 24,
    p: 3
};

let scrollStyle = {
    height: '100%',
    overflowY: 'auto',
    marginTop: 3,
    '&::-webkit-scrollbar': {
        width: 6,
    },
    '&::-webkit-scrollbar-track': {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#333333',
        borderRadius: 8,
    },
    '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: '#555555',
    }
}

const NewsCards = ({ allNews }) => {

    let [modalContent, setModalContent] = useState(null);
    let [modalTitle, setModalTitle] = useState(null);

    let [error, setError] = useState(null);
    let [loading, setLoading] = useState(null);
    let { userAuthState } = useContext(UserAuthContext);

    const [open, setOpen] = useState(false);

    function handleClose() {
        setLoading(null);
        setOpen(false);
    }

    async function handleGptSummary(content, title) {

        setOpen(true);
        setModalTitle(null);
        setModalContent(null);
        setError(null);
        setLoading(true);

        if (!content) {
            setModalTitle(title);
            setModalContent('No content available for this article. Please read the full article.');
            setLoading(null);
            return;
        }

        try {
            let textArray = content.split(' ');

            if (textArray.length > 1310) {
                textArray = textArray.slice(0, 1311);
            }
            textArray = textArray.map(word => {
                if (word.length < 15) return word;
            });

            let text = textArray.join(' ');

            let response = await axios.post('/api/news/summarize', { content: text }, {
                headers: {
                    'Authorization': `Bearer ${userAuthState.user.token}`
                }
            });

            setLoading(null);
            setModalTitle(title);
            setModalContent(response.data.summary);

        } catch (err) {
            setLoading(false);

            if (err.response) {
                setError(err.response.data.errMessage);
            } else {
                setError(err.message);
            }
        }
    }

    function handleFullArticle(link) {
        window.open(link, '_blank');
    }

    return (
        <>
            {/* modal */}
            <div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                        backdrop: {
                            timeout: 500,
                        },
                    }}
                >
                    <Fade in={open}>
                        <Box sx={style}>

                            <IconButton onClick={handleClose} aria-label='close-modal-icon-button' sx={{ position: 'absolute', top: 5, right: 5 }}>
                                <CloseIcon />
                            </IconButton>

                            <Box sx={scrollStyle}>
                                <Box sx={{ paddingRight: 2, paddingBottom: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Typography variant='h5' textAlign='center' color='secondary'>
                                        GPT Summary
                                    </Typography>


                                    {loading && (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 5 }}>
                                            <CircularProgress />
                                        </Box>
                                    )}

                                    {error && (
                                        <Typography variant='body1' color='error' textAlign='center' sx={{ marginTop: 5 }}>
                                            {error && error}
                                        </Typography>
                                    )}


                                    <Typography variant="h6" textAlign='center'>
                                        {modalTitle}
                                    </Typography>
                                    <Typography variant='body1' textAlign='center'>
                                        {modalContent}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Fade>
                </Modal>
            </div>


            {/* cards container */}
            <Box className='all-news'>
                <Grid container spacing={3} sx={{ display: 'flex', alignItems: 'stretch' }}>

                    {allNews.map((news, index) => (
                        <Grid item xs={12} md={6} xl={4} key={index} sx={{ display: 'flex', alignItems: 'stretch' }}>
                            <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'stretch', gap: 1, flex: '1 1 0' }}>
                                <CardMedia
                                    component="img"
                                    sx={{
                                        objectFit: 'cover',
                                        width: {
                                            xs: 'auto',
                                            md: 240,
                                        },
                                        height: {
                                            xs: 350,
                                            md: 'auto'
                                        }
                                    }}
                                    image={news.image_url ? news.image_url : `https://source.unsplash.com/240x200/?news${news.title.split(' ')[0]},${news.title.split(' ')[1]}`}
                                />


                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>

                                    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: 1 }}>
                                        <Button sx={{ backgroundColor: '#f8bbd0', color: 'primary.main' }} size='small'>
                                            {news.category[0]}
                                        </Button>

                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                            {news.title}
                                        </Typography>

                                        <Box>
                                            <Typography variant="subtitle1" component="div">
                                                {news.creator ? news.creator[0] : 'Unknown'}
                                            </Typography>

                                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                                {formatDistanceToNow(new Date(news.pubDate), { addSuffix: true })}
                                            </Typography>
                                        </Box>

                                    </CardContent>

                                    <CardActions sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'flex-end' }}>
                                        <Button color='secondary' variant='outlined' size='small' onClick={() => handleGptSummary(news.content, news.title)}>GPT Summary</Button>
                                        <Button color='secondary' variant='outlined' size='small' onClick={() => handleFullArticle(news.link)}>Full Article</Button>
                                    </CardActions>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </>
    );
}

export default NewsCards;