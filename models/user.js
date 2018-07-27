var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	senderId: {
        type: String,
        default: "N/A"
    },
    name: String,
    email:String,
    password:String,
    company: String,
    plaidId: Number,
    bankName: {
        type: String,
        default: "N/A"
    },
    bankBalance: Number,
    accountType:{
        type: String,
        default: "N/A"
    },
    buckets: {
        bankFees: { type: Number, default: 0      },
        cashAdvance: { type: Number, default: 0 },
        community: { type: Number, default: 0 },
        foodAndDrink: { type: Number, default: 0 },
        healthcare: { type: Number, default: 0 },
        interest: { type: Number, default: 0 },
        payment: { type: Number, default: 0 },
        recreation: { type: Number, default: 0 },
        service: { type: Number, default: 0 },
        shops: { type: Number, default: 0 },
        tax: { type: Number, default: 0 },
        transfer: { type: Number, default: 0 },
        travel: { type: Number, default: 0 } 
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});

var User = mongoose.model('User', userSchema);

module.exports = User;