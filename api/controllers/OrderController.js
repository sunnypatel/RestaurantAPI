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
		var totalSale = req.body.totalSale;
		var totalSalesTax = req.body.totalSalesTax;
		var salesTax = req.body.salesTax;
		var paid = req.body.paid;
		var confirmed = req.body.confirmed;
		var restaurant = req.body.restaurant;
		var items = req.body.items;

		Order.create({
			totalSale: totalSale,
			totalSalesTax: totalSalesTax,
			salesTax: salesTax,
			paid: paid,
			confirmed: confirmed,
			restaurant: restaurant,
			items: items
		})
		.then(function (created){
			log.info(TAG + "Created new order");
			res.status(200).send(created);
		})
		.catch(function (err){
			log.error(TAG + "Failed to create new order: " + err);
			res.send(500);
		});
	}
};
