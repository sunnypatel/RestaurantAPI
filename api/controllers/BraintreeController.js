/**
 * BraintreeController
 *
 * @description :: Server-side logic for managing braintrees
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var braintree = require('braintree');
var log = require('captains-log')();
var CTAG = "BraintreeController: ";
var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "jjr3v8v8c8gv5xpv",
  publicKey: "3bjft3ttty7sg4k8",
  privateKey: "97fec7da34d7a5879df4608d15f13a9e"
});

module.exports = {
	generateToken: function(req, res) {
		var brainTreeCustomerId = req.body.brainTreeCustomerId || res.serverError({"error": "Valid customerId required"});
		gateway.clientToken.generate({
			customerId: brainTreeCustomerId
		}, function (err, response) {
			res.send(response.clientToken);
		});
	},
	createTransaction: function(req, res) {
		var nonce = req.body.nonce || res.serverError({"error": "missing required fields"});
		var amount = req.body.amount || res.serverError({"error": "missing required fields"});
		gateway.transaction.sale({
			amount: amount,
			paymentMethodNonce: nonce,
		}, function (err, result) {
			if (err) {
				res.serverError(err);
			} else {
				res.ok(result);
			}
		});
	},
	createCustomer: function(req, res) {
		var userId = req.body.userId || res.serverError({"error": "Valid userId required"});;
		var firstName = req.body.firstName || "";
		var lastName = req.body.lastName || "";
		var email = req.body.email || "";
		var phone = req.body.phone || "";

		gateway.customer.create({
			firstName: firstName,
			lastName: lastName,
			email: email,
			phone: phone,
			paymentMethodNonce: "nonce-from-the-client"
		}, function (err, result) {
			if (result.success == true) {
				User.update({
					id: userId
				}, {
					brainTreeCustomerId: result.customer.id
				}).exec(function(err, updated){
					if (err) {
						log.info(CTAG + "Error updating user object to braintree customerId")
					} else {
						log.info(CTAG + "Updated user braintree customerId");
					}
				});

				res.ok({
					brainStormCustomerId: result.customer.id
				});
			} else {
				res.serverError(result);
			}
		});
	}
};
