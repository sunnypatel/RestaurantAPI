/**
* Restaurant.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs		:: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		name: {
			type: 'string',
			size: 35,
			required: true,
		},
		google_place_id: {
			type: 'string',
			unique: true,
			required: true
		},
		latitude: {
			type: 'float',
			defaultsTo: 39.9544  // Drexel's 31st and Market
		},
		longitude: {
			type: 'float',
			defaultsTo: -75.1850 // Drexel's 31st and Market
		},
		location: {
			model: 'location'
		},
		address: {
			type: 'string'
		},
		phone: {
			type: 'string',
			size: 15,
		},
		street: {
			type: 'string',
			size: 50
		},
		city: {
			type: 'string',
			size: 20
		},
		state: {
			type: 'string',
			size: 5
		},
		zipcode: {
			type: 'string',
			size: 9
		},
		country: {
			type: 'string',
			size: 10
		},
		items: {
			collection: 'item',
			via: 'restaurantId'
		},
		orders: {
			collection: 'order',
			via: 'restaurantId'
		},
		owners: {
		  collection: 'user',
		  via: 'ownsRestaurants'
		}
	}
};
