/**
 * RestaurantController
 *
 * @description :: Server-side logic for managing Restaurant
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	list : function(req, res) {
		Restaurant.find({
			sort: 'updatedAt DESC'
		}).exec(function findCB(err,restaurants){
			console.log(restaurants);
			return res.view({
				restaurants : restaurants
			});
		});
	},
	create: function(req, res){
		var restaurantName = req.param('restaurantName');
		console.log('Attempting to create new restaurant: ' + restaurantName);

		Restaurant.create({
			name: restaurantName,
		}).exec(function createCB(err, created){
			if (err) {
				return cb(err);
			} else {
				console.log('Restaurant created: ' + created.name);
				res.send(created);
			}
		})
	}
};

