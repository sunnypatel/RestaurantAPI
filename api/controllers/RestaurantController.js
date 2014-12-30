/**
* RestaurantController
*
* @description :: Server-side logic for managing Restaurant
* @help        :: See http://links.sailsjs.org/docs/controllers
*/
var log = require('captains-log')();
var CTAG = "RestaurantController";

module.exports = {
	create: function(req, res){
		var TAG = CTAG + "(create): ";
		var name = req.param('name');
		var longitude = req.param('longitude') || "";
		var latitude = req.param('latitude') || "";
		var street = req.param('street') || "";
		var city = req.param('city') || "";
		var state = req.param('state') || "";
		var zipcode = req.param('zipcode') || "";
		var country = req.param('country') || "";
		var phone = req.param('phone') || "";
		var owner = req.param('userId');

		if (!owner)
			owner = req.session.user.id;
		log.info(TAG + 'Attempting to create new restaurant: ' + name);

		Restaurant.create({
			name: name,
			longitude: longitude,
			latitude: latitude,
			street: street,
			city: city,
			state: state,
			zipcode: zipcode,
			country: country,
			phone: phone,
			owners: owner
		}).exec(function createCB(err, created){
			if (err) {
				log.error(TAG + "Restaurant create failed: " + err);
				res.status(500).send({error: TAG + "Restaurant create failed"});
			}
			log.info(TAG + 'Restaurant created: ' + created.name);
			res.send(created);
		})
	},
	edit: function(req, res) {
		var TAG = CTAG + "(edit): ";
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
			log.info(TAG + "Updated Restaurant("+id+") by User("+req.session.user.id+")");
			res.send(updated);
		})
	}
};
