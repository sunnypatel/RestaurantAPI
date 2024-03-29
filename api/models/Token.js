module.exports = {
    autoPK: false,
    attributes: {
        apiToken: {
            type: 'string',
            primaryKey: true
        },
        expiresAt: {
            type: 'string',
            size: 20             // Waterline ORM 'integer' is int(11) mysql hence string aka varchar(20)
        },
        loggedUser: {
            model: 'user'
        },
        isExpired: {
            type: 'Boolean'
        }
    }
};
