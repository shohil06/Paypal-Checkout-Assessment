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
    $("#totalAmount")[0].innerText = "$" +
        (parseInt($("#labrador_Quantity").val()) * parseFloat($("#labradorAmount")[0].innerText.split("$")[1]) +
            parseInt($("#retriever_Quantity").val()) * parseFloat($("#retrieverAmount")[0].innerText.split("$")[1]) +
            parseInt($("#rottweiler_Quantity").val()) * parseFloat($("#rottweilerAmount")[0].innerText.split("$")[1])).toFixed(2);
});

paypal.Buttons({
    createOrder: function (data, actions) {
        var transactionAmount = parseFloat(parseInt($("#labrador_Quantity").val()) * parseFloat($("#labradorAmount")[0].innerText.split("$")[1]) +
            parseInt($("#retriever_Quantity").val()) * parseFloat($("#retrieverAmount")[0].innerText.split("$")[1]) +
            parseInt($("#rottweiler_Quantity").val()) * parseFloat($("#rottweilerAmount")[0].innerText.split("$")[1])).toFixed(2);
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
    onApprove: function (data, actions) {
        return fetch('/captureOrder', {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                orderID: data.orderID
            })
        }).then(function (res) {
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

}).render('#paypal-button-container');