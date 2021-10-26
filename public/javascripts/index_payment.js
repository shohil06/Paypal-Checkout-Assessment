$('.visibility-cart').on('click', function () {

    var $btn = $(this);
    var $cart = $('.cart');
    console.log($btn);

    if ($btn.hasClass('is-open')) {
        $btn.removeClass('is-open');
        $btn.text('O');
        $cart.removeClass('is-open');
        $cart.addClass('is-closed');
        $btn.addClass('is-closed');
    } else {
        $btn.addClass('is-open');
        $btn.text('X');
        $cart.addClass('is-open');
        $cart.removeClass('is-closed');
        $btn.removeClass('is-closed');
    }


});

$('a.qty-minus').on('click', function (e) {
    e.preventDefault();
    var $this = $(this);
    var $input = $this.closest('div').find('input');
    var $costForOne = parseFloat($this.parent().prev().find("p")[0].innerText.split("$")[1]);
    var value = parseInt($input.val());

    if (value > 1) {
        value = value - 1;
    } else {
        value = 0;
    }
    $this.parent().next().find("p")[0].innerText = "$" + ($costForOne * value).toFixed(2);

    $input.val(value);
    $("#totalAmount")[0].innerText = "$" +
        (parseInt($("#labrador_Quantity").val()) * parseFloat($("#labradorAmount")[0].innerText.split("$")[1]) +
        parseInt($("#retriever_Quantity").val()) * parseFloat($("#retrieverAmount")[0].innerText.split("$")[1]) +
            parseInt($("#rottweiler_Quantity").val()) * parseFloat($("#rottweilerAmount")[0].innerText.split("$")[1])).toFixed(2);
});

$('a.qty-plus').on('click', function (e) {
    e.preventDefault();
    var $this = $(this);
    var $input = $this.closest('div').find('input');
    var $costForOne = parseFloat($this.parent().prev().find("p")[0].innerText.split("$")[1]);
    var value = parseInt($input.val());

    if (value < 100) {
        value = value + 1;
    } else {
        value = 100;
    }
    $this.parent().next().find("p")[0].innerText = "$" + ($costForOne * value).toFixed(2);

    $input.val(value);
    $("#totalAmount")[0].innerText = "$" +
        (parseInt($("#labrador_Quantity").val()) * parseFloat($("#labradorAmount")[0].innerText.split("$")[1]) +
            parseInt($("#retriever_Quantity").val()) * parseFloat($("#retrieverAmount")[0].innerText.split("$")[1]) +
            parseInt($("#rottweiler_Quantity").val()) * parseFloat($("#rottweilerAmount")[0].innerText.split("$")[1])).toFixed(2);});

$('input').on('blur', function () {

    var input = $(this);
    var value = parseInt($(this).val());

    if (value < 0 || isNaN(value)) {
        input.val(0);
    } else if
        (value > 100) {
        input.val(100);
    }
});

$('document').ready(function () {
//     $("#totalAmount")[0].innerText = "$" +
//         (parseInt($("#labrador_Quantity").val()) * parseFloat($("#labradorAmount")[0].innerText.split("$")[1]) +
//             parseInt($("#retriever_Quantity").val()) * parseFloat($("#retrieverAmount")[0].innerText.split("$")[1]) +
//             parseInt($("#rottweiler_Quantity").val()) * parseFloat($("#rottweilerAmount")[0].innerText.split("$")[1])).toFixed(2);
// });

var FUNDING_SOURCES = [
    paypal.FUNDING.PAYPAL,
    paypal.FUNDING.VENMO,
    paypal.FUNDING.PAYLATER,
    paypal.FUNDING.CREDIT,
    paypal.FUNDING.CARD
];

// Loop over each funding source/payment method
FUNDING_SOURCES.forEach(function(fundingSource) {

    // Initialize the buttons
    var button = paypal.Buttons({
        fundingSource: fundingSource
    });

    // Check if the button is eligible
    if (button.isEligible()) {

// paypal.Buttons({
mark({
        style: {
            layout: 'vertical'
        },
    createOrder: function (data, actions) {
        var transactionAmount = parseFloat(parseInt($("#labrador_Quantity").val()) * parseFloat($("#labradorAmount")[0].innerText.split("$")[1]) +
            parseInt($("#retriever_Quantity").val()) * parseFloat($("#retrieverAmount")[0].innerText.split("$")[1]) +
            parseInt($("#rottweiler_Quantity").val()) * parseFloat($("#rottweilerAmount")[0].innerText.split("$")[1])).toFixed(2);
            var transactionAmount = parseFloat($("#totalAmount")[0].innerText.split("$")[1]).toFixed(2);
        return fetch('/createOrder', {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                "intent": "CAPTURE",
                "amount": transactionAmount.toString()
            })
        }).then(function (res) {
            return res.json();
        }).then(function (data) {
            return data.orderID;
        }).catch(function (error) {
                swal(exception.message, "error");
                console.error(exception);
            });
    },
    // createBillingAgreement: function ( data, actions) {
    //         var transactionAmount = parseFloat(parseInt($("#labrador_Quantity").val()) * parseFloat($("#labradorAmount")[0].innerText.split("$")[1]) +
    //         parseInt($("#retriever_Quantity").val()) * parseFloat($("#retrieverAmount")[0].innerText.split("$")[1]) +
    //         parseInt($("#rottweiler_Quantity").val()) * parseFloat($("#rottweilerAmount")[0].innerText.split("$")[1])).toFixed(2);
    //         var transactionAmount = parseFloat($("#totalAmount")[0].innerText.split("$")[1]).toFixed(2);
    //     return fetch('/createBillingAgreement', {
    //         method: 'post',
    //         headers: {
    //             'content-type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             "intent": "CAPTURE",
    //             "amount": transactionAmount.toString()
    //         })
    //     }).then(function (res) {
    //         return res.json();
    //     }).then(function (data) {
    //         console.log(paypal.getCorrelationID())
    //         return data.orderID;
    //     }).catch(function (error) {
    //             swal(exception.message, "error");
    //             console.error(exception);
    //         });
    // },
    // onApprove: function (data, actions) {
    //     swal({ title: "Approval of Agreement in Progress", text: "Agreement Id : " + data.orderID, type: "info", button: false });
    //     console.log(paypal.getCorrelationID())
    //     return fetch('/approveBillingAgreement', {
    //         method: 'post',
    //         headers: {
    //             'content-type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             agreementID: data.billingToken
    //         })
    //     }).then(function (res) {
    //         swal.close();
    //         console.log(paypal.getCorrelationID())
    //         return res.json();
    //     }).then(function (data) {
    //         swal("Billing Agreement Successfully Setup", "Order Id : " + data.id, "success");
    //     });
    // },
    onApprove: function (data, actions) {
        swal({ title: "Transaction In Progress", text: "Order Id : " + data.orderID, type: "info", button: false });
        return fetch('/captureOrder', {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                orderID: data.orderID
            })
        }).then(function (res) {
            swal.close();
            return res.json();
        }).then(function (data) {
            swal("Transaction Successfull", "Order Id : " + data.id, "success");
        });
    },
    onCancel: function (data) {
        swal("Transaction Cancelled",'Order Id : ' + data.orderID, "info");
    },
    onError: function (err) {
        swal("Transaction Error","Some error has Occured !", "error");
    }

},
).render('#paypal-button-container');
    }});







// var script = document.createElement('script');
// script.setAttribute("type", "application/json");
// script.setAttribute("fncls", "fnparams-dede7cc5-15fd-4c75-a9f4-36c430ee3a99");
// script.src = "https://c.paypal.com/da/r/fb.js";
// document.body.appendChild(script);
// f = "any_unique_id"; // In STC tracking_id and PayPal-Metadata-client-id header in POST Create Order API
// s = "Fraudnet_Session_Identifier_" + "any_client_id";

});