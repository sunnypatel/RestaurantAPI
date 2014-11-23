/**
* RestaurantController
*
* @description :: Server-side logic for managing Restaurant
* @help        :: See http://links.sailsjs.org/docs/controllers
*/
var TAG = "RestaurantController: ";
module.exports = {
	list : function(req, res) {
		Restaurant.find({
			sort: 'updatedAt DESC'
		}).exec(function findCB(err,restaurants){
			return res.view({
				restaurants : restaurants
			});
		});
	},
	create: function(req, res){
		var name = req.param('name');
		var longitude = req.param('longitude');
		var latitude = req.param('latitude');
		console.log(TAG + 'Attempting to create new restaurant: ' + name);

		Restaurant.create({
			name: name,
			longitude: longitude,
			latitude: latitude
		}).exec(function createCB(err, created){
			if (err) {
				res.send(500, err);
			} else {
				console.log(TAG + 'Restaurant created: ' + created.name);
				res.redirect('/restaurant/list');
			}
		})
	},
	new: function(req, res){
		return res.view('restaurant/createForm', {
			action : '/restaurant/create',
		});
	},
	edit: function(req, res){
		var restaurantId = req.param('id');
		console.log("Loading edit form for : " + restaurantId)
		Restaurant.findOne({
			id: restaurantId
		}).exec(function findCB(err, found){
			if(err){
				res.send(500, err);
			} else {
				console.log('Editing : ' + found.name);
				return res.view('restaurant/editForm', {
					action : '/restaurant/saveChanges',
					restaurant : found
				});
			}
		});
	},
	saveChanges: function(req, res){
		var restaurant = req.param('id');
		var name = req.param('name');
		var longitude = req.param('longitude');
		var latitude = req.param('latitude');

		Restaurant.update({ id: restaurant }, {
			name: name,
			longitude: longitude,
			latitude: latitude
		}).exec(function updateCB(err, updated){
			if(err) {
				res.send(500, err);
			} else {
				res.redirect('/restaurant/list');
			}
		})
	},
	delete: function(req, res){
		var restaurant = req.param('id');
		Restaurant.destroy({
			id: restaurant
		}).exec(function destroyCB(err, destroyed){
			if (err) {
				res.send(500, err);
			} else {
				console.log('Deleted restaurant: ' + destroyed.name);
				return res.redirect('/restaurant/list');
			}
		});
	}
};
