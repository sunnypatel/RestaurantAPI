/**
* RestaurantController
*
* @description :: Server-side logic for managing Restaurant
* @help        :: See http://links.sailsjs.org/docs/controllers
*/
var CTAG = "RestaurantController";
module.exports = {
	create: function(req, res){
		var TAG = CTAG + "(create) ";
		var name = req.param('name');
		var longitude = req.param('longitude');
		var latitude = req.param('latitude');
		var owner = req.param('userId');

		if (!owner)
			owner = req.session.userId;
		console.log(TAG + 'Attempting to create new restaurant: ' + name);

		Restaurant.create({
			name: name,
			longitude: longitude,
			latitude: latitude,
			owners: owner
		}).exec(function createCB(err, created){
			console.log(TAG + 'Restaurant created: ' + created.name);
			res.send(created);
		})
	},
	edit: function(req, res) {
		var TAG + CTAG + "(edit)";
		var name = req.param('name');
		var longitude = req.param('longitude');
		var latitude = req.param('latitude');
		var id = req.param('id');

		Restaurant.update({
			id:id
		}, {
			name: name,
			longitude: longitude,
			latitude: latitude
		})
		.then(function (updated){
			console.log(TAG + "Updated Restaurant("+id+") by User("+req.session.userId+")");
			res.send(updated);
		})
	}
};
