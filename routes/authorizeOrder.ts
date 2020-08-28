import express = require('express');
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');
const payPalClient = require('./paypalCheckout');
const paypalCredentials = require('../paypalCredentials.json');

router.post("/", async function (req, res) {
    const orderID = req.body.orderID;

    try {
        // True to use SDK
        // False for using REST API
        var use_SDK = paypalCredentials.use_SDK;

        use_SDK === true ? await authorizeOrderApi_From_SDK(orderID, res) : authorizeOrderApi_From_Orders_Capture_Api(orderID, res);
        //await authorizeOrderApi_From_SDK(orderID, res);
        //authorizeOrderApi_From_Orders_Capture_Api(orderID, res)

    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
});

/*  Captures Order using Paypal SDK
*	@param orderId
*	@param responseClient - response
*	@return JSON
*/
async function authorizeOrderApi_From_SDK(orderId, responseClient) {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    try {
        let requestApi = await payPalClient.client();
        const response = await requestApi.execute(request);
        response.result.links.forEach((item, index) => {
            let rel = item.rel;
            let href = item.href;
            let method = item.method;
        });
        console.log(await payPalClient.prettyPrint(response.result));
        const authorizeID = response.result.purchase_units[0]
            .payments.authorizations[0].id;
        console.log("Capture ID : " + authorizeID);
        return responseClient.json(response.result);

    } catch (err) {
        console.error(err);
        return responseClient.send(500);
    }
}

/*  Authorize Order using REST
*	@param orderId
*	@param response - response
*	@return JSON
*/
async function authorizeOrderApi_From_Orders_Capture_Api(orderId, response) {
    var http = require("https");

    var options = {
        "method": "POST",
        "hostname": "api.sandbox.paypal.com",
        "port": null,
        "path": "/v2/checkout/orders/" + orderId.toString() + "/authorize",
        "headers": {
            "content-type": "application/json",
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
            console.log(responseJson);
            response.json(responseJson);
        });
    });

    req.end();
}
