/**
 * LocationController
 *
 * @description :: Server-side logic for managing locations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var log = require('captains-log')();
var CTAG = "LocationController";

module.exports = {
	near: function(req, res) {
		var TAG = CTAG + "(near): ";
		var latitude = req.param('latitude');
		var longitude = req.param('longitude');

		LocationService.findNear(latitude, longitude)
		.then(function(found){
			res.send(200, found);
		})
		.catch(function (err){
			log.error(TAG + "Error locating restaurant");
			res.send(500);
		});
	},
	restaurantLookup: function(req, res) {
		var TAG = CTAG + "(restaurantLookup): ";

		var place_ids = req.body.place_ids;

		Restaurant.find({
			google_place_id: place_ids
		}).exec(function(err, found){
			res.send(found);
		});
	}
};
