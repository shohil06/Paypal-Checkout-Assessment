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
        try {
            const agreementID = req.body.agreementID;
            approveBillingAgreementSetupApi_from_Billing_Agreement_API(agreementID, res);
            //await createBillingAgreementSetupApi_From_SDK(transactionAmount, res);
            //createBillingAgreementSetupApi_from_Billing_Agreement_API(transactionAmount, res)
        }
        catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    });
});
/*  Create Order via REST
*   Creates a new order
*	@param Amount - acceps the amount
*	@param response - response
*	@return JSON
*/
function approveBillingAgreementSetupApi_from_Billing_Agreement_API(agreementID, response) {
    return __awaiter(this, void 0, void 0, function* () {
        var http = require("https");
        var partner_client_id = paypalCredentials.clientId;
        var merchant_payer_id = paypalCredentials.merchant_one_email;
        var jsonPartOne = { "alg": "none" };
        var jsonPartTwo = { "iss": partner_client_id, "payer_id": merchant_payer_id };
        var auth_assertion_BA = Buffer.from(JSON.stringify(jsonPartOne)).toString('base64') + "." + Buffer.from(JSON.stringify(jsonPartTwo)).toString('base64') + ".";
        var ba_token_id = agreementID;
        var options = {
            "method": "POST",
            "hostname": "api-m.sandbox.paypal.com",
            "port": null,
            "path": "v1/billing-agreements/" + ba_token_id + "/agreements",
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
        req.write("");
        req.end();
    });
}
exports.default = router;
//# sourceMappingURL=approveBillingAgreement.js.map