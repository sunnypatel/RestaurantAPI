var Winston = require('winston');
var WinstonGraylog2 = require('winston-graylog2');
var options = {

	name: 'Graylog',
	level: 'debug',
	silent: false,
	handleExceptions: false,
	graylog: {
		servers: [{host: '73.188.53.84', port: 10100}],
		hostname: 'scriber',
		facility: 'RestaurantAPI',
		bufferSize: 1400
	}

};
var log = require('captains-log')({
	custom:new(Winston.Logger)({
		exitOnError: false,
		transports: [new(WinstonGraylog2)(options)]
	})
});

module.exports = function logRequest (req, res, next) {
	log.debug({
		ip: req.ip,
		hostname: req.hostname,
		protocol: req.protocol,
		headers: req.headers,
		body: req.body
	});
	next();
}
