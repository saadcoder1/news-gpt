let UserModel = require('../model/userModel');
let jwt = require('jsonwebtoken');
let stripe = require('stripe')(process.env.stripeSecretKey);

let path = require('path');

// stripe subscription product 
let lineItems = [{ price: 'price_1MjUxCA2ToT62VsuXM2BeGTb', quantity: 1 }];

// helper function to generate jwt
function createToken(_id) {
    return jwt.sign({ _id }, process.env.JWTSECRET, { expiresIn: '3d' });
}

// helper function to generate stripe chekout session
async function createStripeCheckoutSession(email) {
    let session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'subscription',
        customer_email: email,
        success_url: "https://scary-hoodie-bass.cyclic.app/login",
        cancel_url: "https://scary-hoodie-bass.cyclic.app/login"
    })

    return session;
}


// controller to signup users
async function signupUser(req, res) {
    let { email, password } = req.body;

    try {
        await UserModel.signupStatic(email, password);

        let session = await createStripeCheckoutSession(email);

        res.status(200).json({ url: session.url });

    } catch (err) {
        res.status(400).json({ errorMsg: err.message });
    }
}

// controller to log in users
async function loginUser(req, res) {
    let { email, password } = req.body;

    try {
        let user = await UserModel.loginStatic(email, password);

        if (!user.authorized) {
            let session = await createStripeCheckoutSession(email);
            res.status(302).json({ url: session.url });
        } else {
            // if user exists and is authorized
            let token = createToken(user._id)
            res.status(200).json({email: user.email, _id: user._id, token});
        }

    } catch (err) {
        res.status(400).json({ errorMsg: err.message });
    }
}


module.exports = {
    signupUser,
    loginUser
}
