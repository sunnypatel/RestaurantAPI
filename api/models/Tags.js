/**
* Tags.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    autoCreatedAt: false,
    autoUpdatedAt: false,
    attributes: {
        name: {
            type: 'string',
            size: 35
        },
        items: {
            collection: 'Item',
            via: 'tags'
        }
    }
};
