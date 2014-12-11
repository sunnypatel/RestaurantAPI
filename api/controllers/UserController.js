/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var log = require('captains-log')();
var CTAG = "UserController";

module.exports = {
	login: function (req, res) {
		TAG = CTAG + '(Login): ';
		var bcrypt = require('bcrypt');
		var uuid = require('node-uuid');
		var phone = req.body.phone;
		if (!phone || !req.body.password)
			res.send(401, {error: 'Missing fields'});
		else {
			User.findOneByPhone(phone).exec(function (err, user) {
				if (err) res.json({ error: 'DB error' }, 500);

				if (user) {
					bcrypt.compare(req.body.password, user.password, function (err, match) {
						log.info(TAG + "Attempting login user("+user.id+")");
						if (err) res.json({ error: 'Server error' }, 500);

						if (match) {
							// password match
							log.info(TAG + "User("+user.id+") password check passed");

							TokenService.isExpired(user.apiToken)
							.then(function (isExpired){
								if (isExpired) {
									// token is expired
									log.info(TAG + "Token is expired");
									throw new Error('Expired Token');
								} else {
									req.session.userId = user.id;
									// token not expired send old one
									res.json({
										apiToken: user.apiToken
									});
									// Fulfill your promise man!
									return user.apiToken;
								}
							})
							.catch(function (err) {
								// Token expired or not found, either way create a new token
								TokenService.createTokenObj()
								.then(function (tokenObj) {
									// created new token obj
									log.info(TAG + "Received new tokenObj");
									user.apiToken = tokenObj.apiToken;
									user.save(function(err){
										if (err)
											log.info(TAG + "Unable to update user token, err:" + err);
										else
											log.info(TAG + "Updated user with new token");
									});

									tokenObj.loggedUser = user.id;
									tokenObj.save(function(err){
										if (err)
											log.info(TAG + "Unable to update Token.loggedUser, err:" + err);
										else
											log.info(TAG + "Updated token with userId");
									});
									req.session.userId = user.id;
									res.json({apiToken: user.apiToken}, 200);
								})
								.catch(function(err){
									log.error("Something went wrong, err:" + err);
									res.json({err: err}, 500);
								})
							})
						} else {
							if (req.session.userId) req.session.userId = null;
							log.error(TAG + "Login attempt phone("+phone+"), invalid password");
							res.json({ error: 'Invalid password' }, 400);
						}
					});
				} else {
					log.error(TAG + "Login attempt phone("+phone+"), not found");
					res.json({ error: 'User not found, password check failed' }, 404);
				}
			});
		}

	},
	new: function(req, res){
		var TAG = CTAG + "(new): ";
		log.info(TAG + "Creating new user");
		var phone = req.param('phone');
		var password = req.param('password');
		var role = req.param('role');

		if (role=='admin' || !phone || !password) {
			log.error(TAG + "Missing fields");
			res.send(500, {error: 'Missing fields'});
		} else {
			TokenService.createTokenObj()
			.then(function (tokenObj){
				log.info(TAG + "Created new token");
				User.create({
					phone: phone,
					password: password,
					role: role,
					apiToken: tokenObj.apiToken
				})
				.exec(function cb(err, created){
					if (err) {
						log.info(TAG + "Error " + err);
						res.json({error: err}, 500);
					} else if (!err && created) {
						res.send(created);
					} else {
						log.info(TAG + "Attempted creating new user, failed completely");
						res.send(500, {error: 'Crashing and burning here, contact us asap.'});
					}
				});
			})
			.catch(function (err){
				log.info(TAG + "Failed getting token: " + err);
			})
		}
	},
	newAdmin: function(req, res) {
		var TAG = CTAG + "(newAdmin): ";
		var phone = req.param('phone');
		var password = req.param('password');
		var role = req.param('role');

		if (!phone || !password) {
			res.send(401);
		} else {
			TokenService.createTokenObj()
			.then(function (tokenObj){
				log.info(TAG + "Received new token");
				User.create({
					phone: phone,
					password: password,
					role: role,
					apiToken: tokenObj.apiToken
				})
				.exec(function cb(err, created){
					if (err) {
						log.info(TAG + "Error " + err);
						res.json({error: err}, 500);
						throw new Error("Creating new user failed");
					} else if (!err && created) {
						res.send(created);
					} else {
						log.info(TAG + "Attempted creating new user, failed completely");
						res.send(500, {error: 'Crashing and burning here, contact us asap.'});
					}
				});
			})
			.catch(function (err){
				log.info(TAG + "Failed getting token: " + err);
			})
		}
	},
	apiToken: function(req, res) {
		var TAG = CTAG + "(apiToken): ";
		var apiToken = req.param('apiToken');
		if (!apiToken) {
			log.info(TAG + "Missing fields");
			res.send(401);
		}
		else {
			User.findOne({
				apiToken: apiToken
			})
			.populate('ownsRestaurants')
			.then(function (found){
				log.info(TAG + "Token found, checking if expired");
				log.info(found);
				TokenService.isExpired(apiToken)
				.then(function (isExpired){
					if (isExpired === false) {
						log.info(TAG + "User isLoggedIn returning block");
						delete found.password;
						delete found.createdAt;
						delete found.updatedAt;
						delete found.id;
						// user is valid
						return res.send(200, found);
					} else {
						log.info(TAG + "User not found or token mismatch");
						// token not found or expired
						return res.send(401);
					}
				})
				.catch(function (err){
					log.info(TAG + "Token isExpired check failed, err: " + err);
					return res.send(500);
				})
			})
			.catch(function (err){
				log.info(TAG + "apiToken not found : " + err);
				return res.send(500);
			});
		}
	}
}
