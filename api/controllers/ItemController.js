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
		var restaurant = req.param('restaurant');
		if (!restaurantId) { return res.json({error: 'Required field missing'}); }
		var name = req.param('name');
		var price = req.param('price');
		var description = req.param('description');
		var image = req.param('image');
		var tags = req.param('tags');  // SHOULD BE A CSV OF ALL TAGS' IDS
		var ingredients = req.param('ingredients');

		// split tags, ingredients by comma
		//tags = tags.split(",");
		//ingredients = ingredients.split(",");
		log.info(TAG + 'Attempting to create item, for restaurant:' + restaurantId);
		Item.create({
			name: name,
			price: price,
			description: description,
			restaurant: restaurant,
			image: image
		})
		.then(function (created){
			log.info(TAG + "Created new item");
		/*	tags.forEach(function(tag){
				created.tags.add(tag);
			});
			ingredients.forEach(function(ingredient){
				created.ingredients.add(ingredient);
			});
			*/
			res.send(200, created);
		})
	}
};
