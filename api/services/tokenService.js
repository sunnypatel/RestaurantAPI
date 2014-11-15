module.exports = {
    isExpired: function (datetimeToChk) {
        var now = new Date().getTime();
        if (datetimeToChk > now) {
            console.log("in the future");
        }
    },
    generateToken: function() {
        var uuid = require('node-uuid');
        var expireAfterMin = 20;
        var now = new Date().getTime();
        var expiresAt = now + (60000 * expireAfterMin);
        var apiToken = uuid.v1();

        return Token.create({
            apiToken: apiToken,
            expiresAt: expiresAt,
            hasExpired: false
        })
        .then(function (created){
            console.log("Created new token: " + created.apiToken);
            return {
                id: created.id,
                apiToken: created.apiToken,
                expiresAt: expiresAt
            };
        })
        .catch(function (err){
            console.log('Error generateToken: ' + err);
            return { err: err };
        });
        /*
        Token.create({
            apiToken: apiToken,
            expiresAt: expiresAt,
            hasExpired: false
        })
        .exec(function createCB(err, created){
            if(err) return {err: err};
            else if (!err && created){
                return {
                    apiToken: created.apiToken,
                    expiresAt: created.expiresAt
                }
            } else {
                return {
                    err: "Dont know wtf happened" + err
                }
            }
        });*/
    }
}
