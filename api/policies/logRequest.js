var WinstonGraylog2 = require('winston-graylog2');
var options = {

	name: 'Graylog'
	level: 'debug',
	silent: false,
	handleExceptions: false,
	graylog: {
		servers: [{host: 'localhost', port: 12201}, {host: 'remote.host', port: 12201}],
		hostname: 'myServer',
		facility: 'myAwesomeApp',
		bufferSize: 1400
	}

}
var log = require('captains-log')({
	custom:new(winston.Logger)({
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
