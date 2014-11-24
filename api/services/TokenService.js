var TAG = "TokenService: ";

module.exports = {
    /**
    * Check if token is expired,
    * @Params token object or token id
    */
    isExpired: function (token) {
        if (token.expiresAt) {
            console.log(TAG + "Got token object");
            datetimeToChk = token.expiresAt;
            var now = new Date().getTime();
            if (datetimeToChk > now) {
                console.log(TAG + "Token valid");
                return false;
            } else {
                console.log(TAG + "Token expired");
                return true;
            }
        } else {
            console.log(TAG + "Searching by apiToken");
            return Token.findOne({
                apiToken: token
            })
            .exec(function (err, found){
                if (found)
                    return TokenService.isExpired(found);
                    else {
                        console.log(TAG + "Unknown param...returning false");
                        return false;
                    }
                })
            }
        },
    generateToken: function() {
        console.log(TAG + "Generating new token...");
        var uuid = require('node-uuid');
        var expireAfterMin = 60;
        var now = new Date().getTime();
        var expiresAt = now + (60000 * expireAfterMin);
        var apiToken = uuid.v1();

        return Token.create({
            apiToken: apiToken,
            expiresAt: expiresAt,
            hasExpired: false
        })
        .then(function (created){
            console.log(TAG + "Generated new token");
            return {
                apiToken: created.apiToken,
                expiresAt: expiresAt
            };
        })
        .catch(function (err){
            console.log(TAG + 'Error generateToken: ' + err);
            return { err: err };
        });
    }
}
