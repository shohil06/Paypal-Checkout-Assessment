var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const paypal = require('@paypal/checkout-server-sdk');
function client() {
    return __awaiter(this, void 0, void 0, function* () {
        return new paypal.core.PayPalHttpClient(yield environment());
    });
}
function environment() {
    return __awaiter(this, void 0, void 0, function* () {
        var paypalCredentials = yield require('../paypalCredentials');
        var clientId = paypalCredentials.clientId;
        var clientSecret = paypalCredentials.secret;
        return new paypal.core.SandboxEnvironment(clientId, clientSecret);
    });
}
function prettyPrint(jsonData, pre = "") {
    return __awaiter(this, void 0, void 0, function* () {
        let pretty = "";
        function capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
        }
        for (let key in jsonData) {
            if (jsonData.hasOwnProperty(key)) {
                if (isNaN(key))
                    pretty += pre + capitalize(key) + ": ";
                else
                    pretty += pre + (parseInt(key) + 1) + ": ";
                if (typeof jsonData[key] === "object") {
                    pretty += "\n";
                    pretty += yield prettyPrint(jsonData[key], pre + "    ");
                }
                else {
                    pretty += jsonData[key] + "\n";
                }
            }
        }
        return pretty;
    });
}
module.exports = { client: client, prettyPrint: prettyPrint };
//# sourceMappingURL=paypalCheckout.js.map