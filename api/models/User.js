/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    phone: {
      type: 'string',
      size: 15,
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      size: 60,
      required: true
    },
    role: {
      type: 'string',
      size: 10,
      enum: ['admin', 'restaurant', 'user']
    },
    apiToken: {
        model: 'token'
    },
    ownsRestaurants: {
      collection: 'restaurant',
      via:'owners'
    }
  },
  beforeCreate: function (attrs, next) {
    var bcrypt = require('bcrypt');
    bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);

      bcrypt.hash(attrs.password, salt, function(err, hash) {
        if (err) return next(err);

        attrs.password = hash;
        next();
      });
    });
  }
};
