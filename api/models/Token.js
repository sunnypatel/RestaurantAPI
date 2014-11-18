module.exports = {
    autoPK: false,
    attributes: {
        apiToken: {
          type: 'string',
          primaryKey: true
        },
        expiresAt: {
          type: 'integer'
        },
        user: {
            model: 'user'
        }
    }
};
