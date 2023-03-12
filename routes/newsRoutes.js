let express = require('express');
let axios = require('axios');
let { Configuration, OpenAIApi } = require('openai')
let authenticateUser = require('../middleware/authenticateUser');

// openAI api configuration
let configuration = new Configuration({
    apiKey: process.env.openAPIKey,
});
let openai = new OpenAIApi(configuration);


let router = express.Router();
router.use(express.json());


// authenticating user
router.use(authenticateUser);


router.post('/', (req, res) => {
    axios(`https://newsdata.io/api/1/news?apikey=${process.env.newsApiKey}&country=us&language=en`)
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(err => {
            res.status(400).json({ errMessage: "Something went wrong. Please try again." });
        })
})



router.post('/categories', (req, res) => {

    let { category } = req.body;

    axios(`https://newsdata.io/api/1/news?apikey=${process.env.newsApiKey}&country=us&language=en&category=${category}`)
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(err => {
            res.status(400).json({ errMessage: "Something went wrong. Please try again." });
        })
})

let maxLength = 2049;

router.post('/summarize', async (req, res) => {
    let { content } = req.body;

    let textArray = `Summarize this text:\n${content}`.split(' ');

    if(textArray.length > 1300) {
        textArray = textArray.slice(0, 1300);
    }

    let text = textArray.join(' ');

    try {
        const response = await openai.createCompletion({
            model: "text-curie-001",
            prompt: text,
            temperature: 0.7,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        res.status(200).json({ summary: response.data.choices[0].text })
    } catch (err) {
        res.status(400).json({ errMessage: 'Something went wrong. Try again later.' })
    }
})


module.exports = router;