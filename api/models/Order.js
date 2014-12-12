/**
* Order.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
      totalSale: {
          type: 'Float'
      },
      totalSalesTax: {
          type: 'Float'
      },
      salesTax: {
          type: 'Float',
          defaultsTo: 0.07 // 7% Sales Tax
      },
      paid: {
          type: 'Boolean',
          defaultsTo: false
      },
      confirmed: {
          type: 'Boolean',
          defaultsTo: false
      },
      items: {
          collection: 'item',
          via: 'orders'
      },
      restaurant: {
          model: 'restaurant'
      }
  }
};
