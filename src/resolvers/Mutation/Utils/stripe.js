import configureStripe from 'stripe';

const stripe = configureStripe(process.env.STRIPE_SECRET_KEY);

module.exports = stripe;
