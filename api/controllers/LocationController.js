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
		var lat = req.param('latitude');
		var lng = req.param('longitude');

		log.info(TAG + "Searching near: " + lat + ", " + lng);

		Location.native(function(err, collection) {
            if (err) return err;
            log.info("here");
            collection.find({
                coordinates : {
                    $near : {
                        $geometry : {
                            type : "Point",
                            coordinates : [lng, lat]
                        },
                        $maxDistance : 5000
                    }
                }
            })
			.toArray(function(err, results){
				if (err) return res.serverError(err);
				return res.ok(results);
			});
		});
	},
	restaurantLookup: function(req, res) {
		var TAG = CTAG + "(restaurantLookup): ";

		var place_ids = req.body.place_ids;

		Restaurant.find({
			google_place_id: place_ids
		})
		.populate('items')
		.exec(function(err, found){
			res.send(found);
		});
	}
};
