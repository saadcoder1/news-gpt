let express = require('express');
let stripe = require('stripe')(process.env.stripeSecretKey);
let UserModel = require('../model/userModel')
let bodyParser = require('body-parser');

let router = express.Router();

const endpointSecret = process.env.stripeWebhookCLISecret;

// webhook route
router.post('/', bodyParser.raw({ type: 'application/json' }), async (request, response) => {
    let payload = request.body;
    let sig = request.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
        console.log('Webhook Error: \n', err.message);
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = await stripe.paymentIntents.retrieve(event.data.object.id, {
            expand: ['payment_method'],
        });

        let customerEmail = paymentIntent.payment_method.billing_details.email;

        // authorizing the user, as the payment has now been made
        await UserModel.findOneAndUpdate({ email: customerEmail }, { authorized: true });
    }

    response.status(200).end();
});


module.exports = router;