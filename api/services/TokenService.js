var TAG = "TokenService: ";

module.exports = {
    /**
    * Check if token is expired,
    * @Params token object or token id
    */
    isExpired: function (token) {
        console.log(TAG + "Searching for token by apiToken: " + token);
        return Token.findOne({
                apiToken: token
            })
            .then(function (tokenObj){
                console.log(TAG + "Token object found");
                var now = new Date().getTime();
                if (now > tokenObj.expiresAt)
                    return true;
                else
                    return false;
            })
            .catch(function (err){
                console.log(TAG + "isExpired: Token object not found, err:" + err);
            });
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
