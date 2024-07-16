const express = require('express');
const app = express();
const stripe = require('stripe')(require('./config').stripeSecretKey);
const bodyParser = require('body-parser');
const cors = require('cors');
const { stripePublicKey } = require('./config');

app.use(bodyParser.json());
app.use(cors());

app.get('/stripe-public-key', (req, res) => {
    res.json({ publicKey: stripePublicKey });
});

app.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Nombre del Producto',
                },
                unit_amount: 4999,
            },
            quantity: 1,
        }],
        mode: 'payment',
        success_url: 'http://localhost:3000/success.html',
        cancel_url: 'http://localhost:3000/cancel.html',
    });

    res.json({ id: session.id });
});

app.listen(4242, () => console.log('Servidor corriendo en http://localhost:4242'));
