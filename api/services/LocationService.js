var log = require('captains-log')();
var CTAG = "LocationService";

module.exports = {

    findNear: function (latitude, longitude) {
        var TAG = CTAG + "(findNear) ";
        return Restaurant.find()
        .then(function (found){
            log.info(TAG + "Restaurants found near geolocations");
            return found;
        })
        .catch(function (err){
            log.error(TAG + "Error locating restaurants" + err);
            throw new Error(TAG + "Error locating restaurants" + err);
        });
    }
}
