/**
 * OrderController
 *
 * @description :: Server-side logic for managing Orders
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var log = require('captains-log')();
var CTAG = "OrderController";

module.exports = {

	create: function(req, res) {
		var TAG = CTAG + " (create): ";
		var apiToken = req.body.apiToken || res.serverError();
		var totalSale = req.body.totalSale;
		var totalSalesTax = req.body.totalSalesTax;
		var salesTax = req.body.salesTax;
		var paid = req.body.paid;
		var confirmed = req.body.confirmed;
		var restaurantId = req.body.restaurantId;
		var items = req.body.items;
		var nonce = req.body.nonce;

		TokenService.getUserByToken(apiToken)
		.then(function(result){

			console.log(result);
			Order.create({
				totalSale: totalSale,
				totalSalesTax: totalSalesTax,
				salesTax: salesTax,
				paid: paid,
				confirmed: confirmed,
				restaurantId: restaurantId,
				items: items,
				user: result.id
			})
			.then(function (created){
				log.info(TAG + "Created new order");
				Order.publishCreate(created);
				res.status(200).send(created);
			})
			.catch(function (err){
				log.error(TAG + "Failed to create new order: " + err);
				res.send(500);
			});
		})
		.catch(function(err){
			res.serverError(err);
		});
	}
};
