/**
* Restaurant.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {
        name: {
            type: 'string',
            size: 35,
            required: true,
        },
        latitude: {
            type: 'float',
            defaultsTo: 39.9544  // Drexel's 31st and Market
        },
        longitude: {
            type: 'float',
            defaultsTo: -75.1850 // Drexel's 31st and Market
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
