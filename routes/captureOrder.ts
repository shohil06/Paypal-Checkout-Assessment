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

        use_SDK === true ? await captureOrderApi_From_SDK(orderID, res) : captureOrderApi_From_Orders_Capture_Api(orderID, res);
        //await captureOrderApi_From_SDK(orderID, res);
        //captureOrderApi_From_Orders_Capture_Api(orderID, res)

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
async function captureOrderApi_From_SDK(orderId, responseClient) {
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
        const captureID = response.result.purchase_units[0]
            .payments.captures[0].id;
        console.log("Capture ID : " + captureID);
        return responseClient.json(response.result);

    } catch (err) {
        console.error(err);
        return responseClient.sendStatus(500);
    }
}

/*  Captures Order using REST
*	@param orderId
*	@param response - response
*	@return JSON
*/
async function captureOrderApi_From_Orders_Capture_Api(orderId, response) {
    var http = require("https");

    var options = {
        "method": "POST",
        "hostname": "api.sandbox.paypal.com",
        "port": null,
        "path": "/v2/checkout/orders/" + orderId.toString() + "/capture",
        "headers": {
            "content-type": "application/json",
            "Prefer": "representation",
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

export default router;