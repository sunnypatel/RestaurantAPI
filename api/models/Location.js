/**
* Location.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
      latitude: {
          type: 'Float',
      },
      longitude: {
          type: 'Float'
      },
      address: {
          type: 'String',
          size: 25
      },
      address2: {
          type: 'String',
          size: 10
      },
      city: {
          type: 'String',
          size: 20
      },
      state: {
          type: 'String',
          size: 15
      },
      zipcode: {
          type: 'String',
          size: 10
      },
      salesTax: {
          type: 'Float'
      },
      restaurant: {
          model: 'restaurant'
      }
  }
};
