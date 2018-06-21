//var http = require("http");
var paypal = require('paypal-rest-sdk');
require('./configure');
var express = require('express');
var ejs = require('ejs');
var bodyParser = require("body-parser"); 
var app = express();

app.set('view engine', 'ejs');
//Use body-parser
app.use(bodyParser.urlencoded({ extended: false })); 


app.get('/', (req, res) => res.render('index'));

/////////////////////////////////
//app.get('/', (req, res) =>{  
//res.render('index');
 


////////////////////////////////////////////


app.post('/pay', (req, res) => {
	var create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://localhost:3000/sucess",
        "cancel_url": "https://localhost"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "item",
                "sku": "item",
                "price": "1.00",
                "currency": "USD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "USD",
            "total": "1.00"
        },
        "description": "This is the payment description."
    }]
};
	



paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        throw error;
    } else {
        console.log("Create Payment Response");
        console.log(payment.id);
		console.log(payment.links);
		//res.redirect('https://localhost');
		for (var index = 0; index < payment.links.length; index++) {
        //Redirect user to this endpoint for redirect url
            if (payment.links[index].rel === 'approval_url') {
                console.log("******Redirecting to the PayPal site******");
				res.redirect(payment.links[index].href);
            }
        }
		}
    
});

});

app.get('/sucess', (req, res) => {
		var payerID = req.query.PayerID; 
		var paymentId = req.query.paymentId; 
		console.log("paymentId & payerID");
		console.log(payerID);
		console.log(paymentId);
		
	var execute_payment_json = {
	"payer_id": payerID,
    "transactions": [{
        "amount": {
            "currency": "USD",
            "total": "1.00"
        }
    }]
};
		
	
	paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
        console.log(error.response);
        throw error;
    } else {
        console.log("Get Payment Response");
        console.log(JSON.stringify(payment));

		res.render("success");
    }

	});	
});


app.listen(8080, () => console.log('Server Started'));


