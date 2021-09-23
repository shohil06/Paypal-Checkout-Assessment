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
            const transactionAmount = req.body.amount;
            // True to use SDK
            // False for using REST API
            var use_SDK = paypalCredentials.use_SDK;
            use_SDK === true ? createOrderApi_From_SDK(transactionAmount, res) : createOrderApi_from_Orders_Create_API(transactionAmount, res);
            //await createOrderApi_From_SDK(transactionAmount, res);
            //createOrderApi_from_Orders_Create_API(transactionAmount, res)
        }
        catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    });
});
/*  Create Order using Paypal SDK
*   Creates a new order
*	@param Amount - acceps the amount
*	@param responseClient - response
*	@return JSON
*/
function createOrderApi_From_SDK(transacAmount, responseClient) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const request = new paypal.orders.OrdersCreateRequest();
            request.headers["prefer"] = "return=representation";
            request.requestBody({
                "intent": 'CAPTURE',
                // purchase_units: [{
                //         amount: {
                //             currency_code: 'USD',
                //             value: transacAmount
                //         }
                //     }],
                    "purchase_units": [
                        {
                            "reference_id": "camera_shop_seller_1_" + Date.now().toString(),
                            "description": "Camera Shop",
                            "amount": {
                                "currency_code": paypalCredentials.currency_code,
                                "value": transacAmount,
                                "breakdown": {
                                    "item_total": {
                                        "currency_code": paypalCredentials.currency_code,
                                        "value": transacAmount
                                    }
                                }
                            },
                            "payee": {
                                "email_address": paypalCredentials.merchant_one_email
                                    },
                            "items": [
                                {
                                    "name": "T-Shirt",
                                    "description": "Green XL",
                                    "sku": "sku01",
                                    "unit_amount": {
                                        "currency_code": paypalCredentials.currency_code,
                                        "value": transacAmount
                                    },
                                    "quantity": "1",
                                    "category": "PHYSICAL_GOODS"
                                }
                            ],
                            "shipping": {
                                "address": {
                                    "address_line_1": paypalCredentials.shipping_address_line_1,
                                    "address_line_2": paypalCredentials.shipping_address_line_2,
                                    "admin_area_2": paypalCredentials.shipping_admin_area_2,
                                    "admin_area_1": paypalCredentials.shipping_admin_area_1,
                                    "postal_code": paypalCredentials.shipping_postal_code,
                                    "country_code": paypalCredentials.shipping_country_code
                                }
                            },
                            "shipping_method": "United Postal Service",
                            // "payment_instruction": {
                            //     "platform_fees": [
                            //         {
                            //             "amount": {
                            //                 "currency_code": paypalCredentials.currency_code,
                            //                 "value": paypalCredentials.platform_fee
                            //             },
                            //             "payee": {
                            //                 "email_address": paypalCredentials.partner_email
                            //             }
                            //         }
                            //     ]
                            // },
                            "payment_group_id": 1,
                            "custom_id": "custom_value_" + Date.now().toString(),
                            "invoice_id": "invoice_number_" + Date.now().toString(),
                            "soft_descriptor": "Payment Camera Shop"
                        },
                        {
                            "reference_id": "camera_shop_seller_2_" + Date.now().toString(),
                            "description": "Camera Shop",
                            "amount": {
                                "currency_code": paypalCredentials.currency_code,
                                "value": transacAmount,
                                "breakdown": {
                                    "item_total": {
                                        "currency_code": paypalCredentials.currency_code,
                                        "value": transacAmount
                                    }
                                }
                            },
                            "payee": {
                                "email_address": paypalCredentials.merchant_two_email
                                    },
                            "items": [
                                {
                                    "name": "T-Shirt",
                                    "description": "Green XL",
                                    "sku": "sku01",
                                    "unit_amount": {
                                        "currency_code": paypalCredentials.currency_code,
                                        "value": transacAmount
                                    },
                                    "quantity": "1",
                                    "category": "PHYSICAL_GOODS"
                                }
                            ],
                            "shipping": {
                                "address": {
                                    "address_line_1": paypalCredentials.shipping_address_line_1,
                                    "address_line_2": paypalCredentials.shipping_address_line_2,
                                    "admin_area_2": paypalCredentials.shipping_admin_area_2,
                                    "admin_area_1": paypalCredentials.shipping_admin_area_1,
                                    "postal_code": paypalCredentials.shipping_postal_code,
                                    "country_code": paypalCredentials.shipping_country_code
                                }
                            },
                            "shipping_method": "United Postal Service",
                            // "payment_instruction": {
                            //     "platform_fees": [
                            //         {
                            //             "amount": {
                            //                 "currency_code": paypalCredentials.currency_code,
                            //                 "value": paypalCredentials.platform_fee
                            //             },
                            //             "payee": {
                            //                 "email_address": paypalCredentials.partner_email
                            //             }
                            //         }
                            //     ]
                            // },
                            "payment_group_id": 1,
                            "custom_id": "custom_value_" + Date.now().toString(),
                            "invoice_id": "invoice_number_" + Date.now().toString(),
                            "soft_descriptor": "Payment Camera Shop"
                        }
                    ],
                    "application_context": {
                        "return_url": "https://webhook.site/26b032c1-4fb1-4f69-90c3-bbe7c245f08f",
                        "cancel_url": "https://webhook.site/26b032c1-4fb1-4f69-90c3-bbe7c245f08f",
                        "user_action": "PAY_NOW"
                    }
            });
            let requestClient = yield payPalClient.client();
            const response = yield requestClient.execute(request);
            response.result.links.forEach((item, index) => {
                let rel = item.rel;
                let href = item.href;
                let method = item.method;
            });
            console.log(yield payPalClient.prettyPrint(response.result));
            response.result["orderID"] = response.result.id;
            return responseClient.json(response.result);
        }
        catch (e) {
            console.log(e);
        }
    });
}
/*  Create Order via REST
*   Creates a new order
*	@param Amount - acceps the amount
*	@param response - response
*	@return JSON
*/
function createOrderApi_from_Orders_Create_API(transacAmount, response) {
    return __awaiter(this, void 0, void 0, function* () {
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
            "purchase_units": [
                {
                    "reference_id": "camera_shop_seller_1_" + Date.now().toString(),
                    "description": "Camera Shop",
                    "amount": {
                        "currency_code": paypalCredentials.currency_code,
                        "value": transacAmount,
                        "breakdown": {
                            "item_total": {
                                "currency_code": paypalCredentials.currency_code,
                                "value": transacAmount
                            }
                        }
                    },
                    "payee": {
                        "email_address": paypalCredentials.merchant_one_email
                    },
                    "items": [
                        {
                            "name": "T-Shirt",
                            "description": "Green XL",
                            "sku": "sku01",
                            "unit_amount": {
                                "currency_code": paypalCredentials.currency_code,
                                "value": transacAmount
                            },
                            "quantity": "1",
                            "category": "PHYSICAL_GOODS"
                        }
                    ],
                    "shipping": {
                        "address": {
                            "address_line_1": paypalCredentials.shipping_address_line_1,
                            "address_line_2": paypalCredentials.shipping_address_line_2,
                            "admin_area_2": paypalCredentials.shipping_admin_area_2,
                            "admin_area_1": paypalCredentials.shipping_admin_area_1,
                            "postal_code": paypalCredentials.shipping_postal_code,
                            "country_code": paypalCredentials.shipping_country_code
                }
                    },
                    "shipping_method": "United Postal Service",
                    "payment_instruction": {
                        "platform_fees": [
                            {
                                "amount": {
                                    "currency_code": paypalCredentials.currency_code,
                                    "value": paypalCredentials.platform_fee
                                },
                                "payee": {
                                    "email_address": paypalCredentials.partner_email
                                }
                            }
                        ]
                    },
                    "payment_group_id": 1,
                    "custom_id": "custom_value_" + Date.now().toString(),
                    "invoice_id": "invoice_number_" + Date.now().toString(),
                    "soft_descriptor": "Payment Camera Shop"
                },
                {
                    "reference_id": "camera_shop_seller_2_" + Date.now().toString(),
                    "description": "Camera Shop",
                    "amount": {
                        "currency_code": paypalCredentials.currency_code,
                        "value": transacAmount,
                        "breakdown": {
                            "item_total": {
                                "currency_code": paypalCredentials.currency_code,
                                "value": transacAmount
                            }
                        }
                    },
                    "payee": {
                        "email_address": paypalCredentials.merchant_two_email
                    },
                    "items": [
                        {
                            "name": "T-Shirt",
                            "description": "Green XL",
                            "sku": "sku01",
                            "unit_amount": {
                                "currency_code": paypalCredentials.currency_code,
                                "value": transacAmount
                            },
                            "quantity": "1",
                            "category": "PHYSICAL_GOODS"
                        }
                    ],
                    "shipping": {
                        "address": {
                            "address_line_1": paypalCredentials.shipping_address_line_1,
                            "address_line_2": paypalCredentials.shipping_address_line_2,
                            "admin_area_2": paypalCredentials.shipping_admin_area_2,
                            "admin_area_1": paypalCredentials.shipping_admin_area_1,
                            "postal_code": paypalCredentials.shipping_postal_code,
                            "country_code": paypalCredentials.shipping_country_code
                }
                    },
                    "shipping_method": "United Postal Service",
                    "payment_instruction": {
                        "platform_fees": [
                            {
                                "amount": {
                                    "currency_code": paypalCredentials.currency_code,
                                    "value": paypalCredentials.platform_fee
                                },
                                "payee": {
                                    "email_address": paypalCredentials.partner_email
                                }
                            }
                        ]
                    },
                    "payment_group_id": 1,
                    "custom_id": "custom_value_" + Date.now().toString(),
                    "invoice_id": "invoice_number_" + Date.now().toString(),
                    "soft_descriptor": "Payment Camera Shop"
                }
            ],
            "application_context": {
                "return_url": "https://webhook.site/26b032c1-4fb1-4f69-90c3-bbe7c245f08f",
                "cancel_url": "https://webhook.site/26b032c1-4fb1-4f69-90c3-bbe7c245f08f",
                "user_action": "PAY_NOW"
            }        }));
        req.end();
    });
}
exports.default = router;
//# sourceMappingURL=createOrder.js.map