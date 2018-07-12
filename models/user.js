var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: String,
    email:String,
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
        gas: { type: Number, default: 0      },
        entertainment: { type: Number, default: 0 },
        rent: { type: Number, default: 0 },
        utility : {
            electricity: Number,
            mobile: Number,
            laundry: Number,
            wifi: Number
        }
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});

var User = mongoose.model('User', userSchema);

module.exports = User;