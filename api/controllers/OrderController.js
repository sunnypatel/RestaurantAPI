/**
 * OrderController
 *
 * @description :: Server-side logic for managing Orders
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var log = require('captains-log')();
var Promise = require('bluebird');
var CTAG = "OrderController";

module.exports = {
	list: function(req,res){
		Order.find({id: req.body.orderId})
		.then(function(results){
			res.send(results);
		});
	},
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

		var itemObjs = [];
		Promise.map(items, function(itemId){
			return Item.findOne({
				id: itemId
			}).then(function(resultItemObj){
				return resultItemObj;
			}).catch(function(err){
				return err;
			});
		}).then(function(itemObjs){

			var calculatedTotal = itemObjs.reduce(function(saleSum, item, index){
				saleSum += item.price;
				return saleSum;
			}, 0);

			log.error(calculatedTotal);
			var totalSale = req.body.totalSale || calculatedTotal;
			log.error(totalSale);
			log.info('items');
			log.info(items);
			TokenService.getUserByToken(apiToken)
			.then(function(userObj){
				Order.create({
					totalSale: totalSale,
					totalSalesTax: totalSalesTax,
					salesTax: salesTax,
					paid: paid,
					confirmed: confirmed,
					restaurantId: restaurantId,
					user: userObj.id,
					nonce: nonce
				})
				.then(function (created){
					created.items.add(items);
					created.save(function(err, updated){
						created = updated;
						console.log('saving');
						console.log(updated);
					});
					/*
					items.forEach(function(itemId){
						created.items.add(itemId);
						created.save(function(err,s){
							console.log("save");
							console.log(err);
							console.log(s);
						});
					});*/
					log.info(TAG + "Created new order");
					log.info(created);
					Order.find({id: created.id})
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
			log.error(TAG + "Error getting item objects");
			log.error(err);
		});

	}
};
