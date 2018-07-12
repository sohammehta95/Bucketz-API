var mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.connect("mongodb://soham:soham1@ds233551.mlab.com:33551/bucketz-db", { useMongoClient: true });

mongoose.Promise = Promise;

module.exports.User = require("./user");