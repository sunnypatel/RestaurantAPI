/**
* Location.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var log = require('captains-log')();

module.exports = {
    connection: 'mongodbCluster',

    attributes: {
      coordinates: {
          type: 'json'
      },
      restaurant: {
          model: 'restaurant'
      }
    }
}
