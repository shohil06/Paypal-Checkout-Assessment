const paypal = require('@paypal/checkout-server-sdk');

async function client() {
    return new paypal.core.PayPalHttpClient(await environment());
}

async function environment() {
    var paypalCredentials = await require('../paypalCredentials');
    var clientId = paypalCredentials.clientId;
    var clientSecret = paypalCredentials.secret;
    return new paypal.core.SandboxEnvironment(
        clientId, clientSecret
    );
}

async function prettyPrint(jsonData, pre = "") {
    let pretty = "";
    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
    for (let key in jsonData) {
        if (jsonData.hasOwnProperty(key)) {
            if (isNaN(key as any))
                pretty += pre + capitalize(key) + ": ";
            else
                pretty += pre + (parseInt(key) + 1) + ": ";
            if (typeof jsonData[key] === "object") {
                pretty += "\n";
                pretty += await prettyPrint(jsonData[key], pre + "    ");
            }
            else {
                pretty += jsonData[key] + "\n";
            }

        }
    }
    return pretty;
}

module.exports = { client: client, prettyPrint: prettyPrint };