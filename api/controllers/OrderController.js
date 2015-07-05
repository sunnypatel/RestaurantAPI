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
		var totalSalesTax = req.body.totalSalesTax;
		var salesTax = req.body.salesTax;
		var paid = req.body.paid;
		var confirmed = req.body.confirmed;
		var restaurantId = req.body.restaurantId;
		var items = req.body.items;
		var nonce = req.body.nonce;

		Item.find({
			id : items
		})
		.then(function(itemsObj) {
			var calculatedTotal = itemsObj.reduce(function(saleSum, item, index){
				saleSum += item.price;
				return saleSum;
			}, 0);

			log.error(calculatedTotal);
			var totalSale = req.body.totalSale || calculatedTotal;
			log.error(totalSale);

			TokenService.getUserByToken(apiToken)
			.then(function(userObj){
				Order.create({
					totalSale: totalSale,
					totalSalesTax: totalSalesTax,
					salesTax: salesTax,
					paid: paid,
					confirmed: confirmed,
					restaurantId: restaurantId,
					items: items,
					user: userObj.id,
					nonce: nonce
				})
				.then(function (created){
					log.info(TAG + "Created new order");
					Order.findOne({id: created.id})
					.populate('items')
					.populate('user')
					.then(function(createdOrderObj){
						Order.publishCreate(createdOrderObj);
						res.send(200, createdOrderObj);
					})
					.catch(function(err){
						log.error(TAG + "Failed to get order: " + err);
						res.serverError(TAG + "Failed to get order: " + err);
					});
				})
				.catch(function (err){
					log.error(TAG + "Failed to create new order: " + err);
					res.send(500);
				});
			})
			.catch(function(err){  // user not found
				log.error(CTAG + "Failed to get user" + err);
				res.serverError();
			});

		}).catch(function(err){
			log.error(TAG + err);
			res.serverError(err);
		});

	}
};
