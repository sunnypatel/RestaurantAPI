/**
* Item.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {
        name: {
            type: 'string'
        },
        price: {
            type: 'float'
        },
        description: {
            type: 'string'
        },
        image: {
            type: 'string'
        },
        restaurant: {
            model: 'restaurant',
            required: true
        },
        tags: {
            collection: 'Tags',
            via: 'items'
        },
        ingredents: {
            collection: 'Ingredents',
            via: 'items'
        }
    }
};
