import express = require('express');
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');
const payPalClient = require('./paypalCheckout');
const paypalCredentials = require('../paypalCredentials.json');

router.post("/", async function (req, res) {
    try {
        console.log(res);
    } catch (err) {
        console.error(err);
    }
});

export default router;