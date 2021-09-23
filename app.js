"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const createOrder_1 = require("./routes/createOrder");
const captureOrder_1 = require("./routes/captureOrder");
const createBillingAgreementSetup_1 = require("./routes/createBillingAgreementSetup");
const approveBillingAgreement_1 = require("./routes/approveBillingAgreement");
const webhookHandler_1 = require("./routes/webhookHandler");
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.set('public', path.join(__dirname, '/public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, '/public')));
app.use('/createOrder', createOrder_1.default);
app.use('/captureOrder', captureOrder_1.default);
app.use('/createBillingAgreement', createBillingAgreementSetup_1.default);
app.use('/approveBillingAgreement', approveBillingAgreement_1.default);
app.use('/webhook', webhookHandler_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err['status'] || 500);
        res.json({ error: err });
    });
}
// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: err });
});
app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
//# sourceMappingURL=app.js.map