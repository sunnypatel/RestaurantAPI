/**
* Item.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {
        name: {
            type: 'string',
            size: 35
        },
        price: {
            type: 'float',
            required: true,
            defaultsTo: 0.0
        },
        description: {
            type: 'text'
        },
        image: {
            type: 'string'
        },
        restaurantId: {
            model: 'restaurant',
            required: true
        },
        tags: {
            collection: 'Tags',
            via: 'items'
        },
        ingredients: {
            collection: 'ingredients',
            via: 'items'
        },
        orders: {
            collection: 'Order',
            via: 'items'
        }
    }
};
