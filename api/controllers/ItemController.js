/**
 * ItemController
 *
 * @description :: Server-side logic for managing Items
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	create: function(req, res){
		var restaurantId = req.param('restaurantId');
		var name = req.param('name');
		var description = req.param('description');
		var image = req.param('image');
		var tags = req.param('tags');  // SHOULD BE A CSV OF ALL TAGS' IDS
		var ingredents = req.param('ingredents');

		
	}
};
