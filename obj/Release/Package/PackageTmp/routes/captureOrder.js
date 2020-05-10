"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');
const payPalClient = require('./paypalCheckout');
const paypalCredentials = require('../paypalCredentials.json');
router.post("/", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const orderID = req.body.orderID;
        try {
            yield captureOrderApi_From_SDK(orderID, res);
            //captureOrderApi_From_Orders_Capture_Api(orderID, res)
        }
        catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    });
});
function captureOrderApi_From_SDK(orderId, responseClient) {
    return __awaiter(this, void 0, void 0, function* () {
        const request = new paypal.orders.OrdersCaptureRequest(orderId);
        request.requestBody({});
        try {
            let requestApi = yield payPalClient.client();
            const response = yield requestApi.execute(request);
            response.result.links.forEach((item, index) => {
                let rel = item.rel;
                let href = item.href;
                let method = item.method;
            });
            console.log(yield payPalClient.prettyPrint(response.result));
            const captureID = response.result.purchase_units[0]
                .payments.captures[0].id;
            console.log("Capture ID : " + captureID);
            return responseClient.json(response.result);
        }
        catch (err) {
            console.error(err);
            return responseClient.send(500);
        }
    });
}
function captureOrderApi_From_Orders_Capture_Api(orderId, response) {
    return __awaiter(this, void 0, void 0, function* () {
        var http = require("https");
        var options = {
            "method": "POST",
            "hostname": "api.sandbox.paypal.com",
            "port": null,
            "path": "/v2/checkout/orders/" + orderId.toString() + "/capture",
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
    });
}
exports.default = router;
//# sourceMappingURL=captureOrder.js.map