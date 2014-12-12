/**
 * ItemController
 *
 * @description :: Server-side logic for managing Items
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var log = require('captains-log')();
var CTAG = "ItemController";

module.exports = {
	create: function(req, res){
		var TAG = CTAG + "(create) ";
		var restaurantId = req.body.restaurantId;
		if (!restaurantId) { return res.json({error: 'Required field missing'}); }
		var name = req.body.name;
		var price = req.body.price;
		var description = req.body.description;
		var image = req.body.image;
		var tags = req.body.tags;
		var ingredients = req.body.ingredients;


		log.info(TAG + 'Attempting to create item, for restaurant:' + restaurantId);
		Item.create({
			name: name,
			price: price,
			description: description,
			restaurantId: restaurantId,
			image: image,
			tags: tags,
			ingredients: ingredients
		})
		.then(function (created){
			log.info(TAG + "Created new item");
			res.send(200, created);
		})
		.catch(function (err) {
			log.error(TAG + "Error creating new item: " + err);
			res.send(500);
		})
	}
};
