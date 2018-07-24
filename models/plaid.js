var mongoose = require('mongoose');
// mongoose.set('debug', true);
mongoose.connect(process.env.DATABASEURL, { useMongoClient: true });

mongoose.Promise = Promise;

var plaidSchema = new mongoose.Schema({
	senderId: { type: String, default: "N/A"},
	accounts: {type: Array},
	item: {type: Array},
	institution: {type: Array},
	transactions: {type: Array},
    plaidId: Number,
    created_date: {
        type: Date,
        default: Date.now
    }
});

module.exports.Plaid = mongoose.model('Plaid', plaidSchema);