module.exports = {
    attributes: {
        apiToken: {
          type: 'string',
          // TODO: Put index here, faster lookups
        },
        expiresAt: {
          type: 'integer'
        },
        hasExpired: {
            type: 'boolean',
            // TODO: put an index here, faster lookups
        },
        user: {
            model: 'user'
        }
    }
};
