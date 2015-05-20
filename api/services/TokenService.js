var log = require('captains-log')();
var CTAG = "TokenService: ";
var expiresAfterMin = 60*10000*100;

module.exports = {
    /**
    * Check if token is expired,
    * @Params token object or token id
    */
    isExpired: function (apiToken) {
        var TAG = CTAG + "(isExpired) ";
        return Token.findOne({
            apiToken: apiToken
        })
        .then(function (tokenObj){
            log.info(TAG + "Token object found");
            var now = new Date().getTime();
            if (now > parseInt(tokenObj.expiresAt)) {
                log.info(TAG + "Expired token");
                return true;
            } else {
                log.info(TAG + "Valid token");
                return false;
            }
        })
        .catch(function (err){
            log.error(TAG + "isExpired: Token object not found, err:" + err);
            throw new Error(TAG + "isExpired: Token object not found, err:" + err);
        });
    },
    createTokenObj: function() {
        var TAG = CTAG + "(createTokenObj) ";
        var apiToken = TokenService.generateToken();
        var now = new Date().getTime();
        var expiresAt = now + (60000 * expiresAfterMin);

        return Token.create({
            apiToken: apiToken,
            expiresAt: expiresAt
        })
        .then(function (created){
            log.info(TAG + "Generated new token");
            return created;
        })
        .catch(function (err){
            log.error(TAG + 'Error generateToken: ' + err);
            throw new Error(TAG + 'Error generateToken: ' + err);
        });
    },
    getUserByToken: function(apiToken) {
        var TAG = CTAG + "(getUserByToken) ";
        return User.findOne({
            apiToken: apiToken
        })
        .then(function(userObj){
            if(userObj) {
                log.info(TAG + "User found via tokenObj");
                return userObj;
            } else {
                log.error(TAG + "User not found with token");
                throw new Error(TAG + "User not found with token");
            }
        })
        .catch(function(err){
            throw new Error(TAG + " " + err);
        })
    },
    updateToken: function(oldApiToken) {
        var TAG = CTAG + "(updateToken) ";
        var now = new Date().getTime();
        var expiresAt = now + (60000 * expiresAfterMin);

        var newToken = {
            apiToken: TokenService.generateToken(),
            expiresAt: expiresAt
        }
        Token.update({apiToken:oldApiToken},newToken)
        .exec(function(err, updated){
            if (err) {
                log.error("Token not updated");
                log.error(err);
            } else {
                log.info("Token updated");
                log.info(updated);
            }
        })
    },
    generateToken: function() {
        var uuid = require('node-uuid');
        return uuid.v1();
    }
}
