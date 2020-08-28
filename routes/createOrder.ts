import express = require('express');
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');
const payPalClient = require('./paypalCheckout');
const paypalCredentials = require('../paypalCredentials.json');

router.post("/", async function (req, res) {

    try {
        const transactionAmount = req.body.amount;

        // True to use SDK
        // False for using REST API
        var use_SDK = paypalCredentials.use_SDK;
        use_SDK === true ? createOrderApi_From_SDK(transactionAmount, res) : createOrderApi_from_Orders_Create_API(transactionAmount, res);

        //await createOrderApi_From_SDK(transactionAmount, res);
        //createOrderApi_from_Orders_Create_API(transactionAmount, res)
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
});

/*  Create Order using Paypal SDK
*   Creates a new order
*	@param Amount - acceps the amount
*	@param responseClient - response
*	@return JSON
*/
async function createOrderApi_From_SDK(transacAmount, responseClient) {
    try {
        const request = new paypal.orders.OrdersCreateRequest();
        request.headers["prefer"] = "return=representation";
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: transacAmount
                }
            }]
        });
        let requestClient = await payPalClient.client();
        const response = await requestClient.execute(request);
        response.result.links.forEach((item, index) => {
            let rel = item.rel;
            let href = item.href;
            let method = item.method;
        });
        console.log(await payPalClient.prettyPrint(response.result));
        response.result["orderID"] = response.result.id
        return responseClient.json(response.result);
    }
    catch (e) {
        console.log(e)
    }
}

/*  Create Order via REST
*   Creates a new order
*	@param Amount - acceps the amount
*	@param response - response
*	@return JSON
*/
async function createOrderApi_from_Orders_Create_API(transacAmount, response) {
    var http = require("https");

    var options = {
        "method": "POST",
        "hostname": "api.sandbox.paypal.com",
        "port": null,
        "path": "/v2/checkout/orders",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": "Basic " + Buffer.from(paypalCredentials.clientId + ":" + paypalCredentials.secret).toString('base64')
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
            responseJson["orderID"] = responseJson.id;
            console.log(responseJson);
            response.json(responseJson);
        });
    });

    req.write(JSON.stringify({
        intent: 'CAPTURE',
        purchase_units:
            [{
                amount: { currency_code: 'USD', value: transacAmount }
            }],
        application_context: { return_url: '', cancel_url: '' }
    }));
    req.end();
}

export default router;