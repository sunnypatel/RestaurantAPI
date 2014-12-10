module.exports = {
    autoPK: false,
    attributes: {
        apiToken: {
            type: 'string',
            primaryKey: true
        },
        expiresAt: {
            type: 'integer',
            size: 20  // required for sql dbs, since int(11) is only 32bits
        },
        loggedUser: {
            model: 'user'
        }
    }
};
