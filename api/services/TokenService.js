var CTAG = "TokenService: ";
var expiresAfterMin = 60;


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
            console.log(TAG + "Token object found");
            var now = new Date().getTime();
            if (now > parseInt(tokenObj.expiresAt)) {
                console.log(TAG + "Expired token");
                return true;
            } else {
                console.log(TAG + "Valid token");
                return false;
            }
        })
        .catch(function (err){
            console.log(TAG + "isExpired: Token object not found, err:" + err);
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
            console.log(TAG + "Generated new token");
            return created;
        })
        .catch(function (err){
            console.log(TAG + 'Error generateToken: ' + err);
            throw new Error(TAG + 'Error generateToken: ' + err);
        });
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
                console.log("Token not updated");
                console.log(err);
            } else {
                console.log("Token uupdated");
                console.log(updated);
            }
        })
    },
    generateToken: function() {
        var uuid = require('node-uuid');
        return uuid.v1();
    }
}
