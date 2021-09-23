import express = require('express');
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');
const payPalClient = require('./paypalCheckout');
const paypalCredentials = require('../paypalCredentials.json');

router.post("/", async function (req, res) {

    try {
        const transactionAmount = req.body.amount;

        createBillingAgreementSetupApi_from_Billing_Agreement_API(transactionAmount, res);

        //await createBillingAgreementSetupApi_From_SDK(transactionAmount, res);
        //createBillingAgreementSetupApi_from_Billing_Agreement_API(transactionAmount, res)
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
});

/*  Create Order via REST
*   Creates a new order
*	@param Amount - acceps the amount
*	@param response - response
*	@return JSON
*/
async function createBillingAgreementSetupApi_from_Billing_Agreement_API(transacAmount, response) {
    var http = require("https");

    var partner_client_id = paypalCredentials.clientId;
    var merchant_payer_id = paypalCredentials.merchant_one_email;
    var jsonPartOne =  {"alg":"none"};

    var jsonPartTwo = { "iss" : partner_client_id,"payer_id" : merchant_payer_id };

    var auth_assertion_BA = Buffer.from(JSON.stringify(jsonPartOne)).toString('base64') + "." + Buffer.from(JSON.stringify(jsonPartTwo)).toString('base64') + ".";


    var options = {
        "method": "POST",
        "hostname": "api-m.sandbox.paypal.com",
        "port": null,
        "path": "/v1/billing-agreements/agreement-tokens",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": "Basic " + Buffer.from(paypalCredentials.clientId + ":" + paypalCredentials.secret).toString('base64'),
            "Paypal-Auth-Assertion": auth_assertion_BA
        }
    };

    var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            var body = Buffer.concat(chunks);
            var responseJson = JSON.parse(body.toString());
            responseJson["orderID"] = responseJson.token_id;
            console.log(responseJson);
            response.json(responseJson);
        });
    });

    req.write(JSON.stringify({
        "description":"Partner 3rd RT Testing",
        "payer":{
            "payment_method":"paypal",
            "payer_info":{
                "email":paypalCredentials.buyer_email,
                "first_name":"Sample",
                "last_name":"Test Buyer",
                "phone":"+12348812381"
            }
        },
        "shipping_address":{
            // "line_1": paypalCredentials.shipping_address_line_1,
            // "city": paypalCredentials.shipping_admin_area_2,
            // "state": paypalCredentials.shipping_admin_area_1,
            // "postal_code": paypalCredentials.shipping_postal_code,
            // "country_code": paypalCredentials.shipping_country_code
            "line1":"122233",
            "city":"SG",
            "state":"SG",
            "postal_code":"305467",
            "country_code":"SG"
        },     
        "plan":{
        
            "type":"MERCHANT_INITIATED_BILLING",
            "merchant_preferences":{
                "cancel_url":paypalCredentials.return_url,
                "return_url":paypalCredentials.return_url,
                "accepted_pymt_type":"INSTANT",
                "skip_shipping_address":"false",
            "immutable_shipping_address":"true"
            }
        },
        "merchant_custom_data":"Partner_RT"
    }
));
    req.end();
}

export default router;