import debug = require('debug');
import express = require('express');
import path = require('path');
const bodyParser = require('body-parser');

import createOrder from './routes/createOrder';
import captureOrder from './routes/captureOrder';
import createBillingAgreement from './routes/createBillingAgreementSetup';
import approveBillingAgreement from './routes/approveBillingAgreement';
import webhookHandler from './routes/webhookHandler';

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.set('public', path.join(__dirname, '/public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, '/public')));
app.use('/createOrder', createOrder);
app.use('/captureOrder', captureOrder);
app.use('/createBillingAgreement', createBillingAgreement);
app.use('/approveBillingAgreement', approveBillingAgreement);
app.use('/webhook',webhookHandler);

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
    app.use((err: any, req, res, next) => {
        res.status(err['status'] || 500);
        res.json({ error: err })
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err: any, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: err })
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
