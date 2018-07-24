'use strict';

var express = require('express');
var router = express.Router();
var db = require("../models/plaid");


var envvar = require('envvar');
var bodyParser = require('body-parser');
var moment = require('moment');
var plaid = require('plaid');

require('dotenv').config(); 

var APP_PORT = process.env.PORT || envvar.number('APP_PORT', 8000);
var PLAID_CLIENT_ID = envvar.string('PLAID_CLIENT_ID');
var PLAID_SECRET = envvar.string('PLAID_SECRET');
var PLAID_PUBLIC_KEY = envvar.string('PLAID_PUBLIC_KEY');
var PLAID_ENV = envvar.string('PLAID_ENV', 'sandbox');

// We store the access_token in memory - in production, store it in a secure
// persistent data store
var ACCESS_TOKEN = null;
var PUBLIC_TOKEN = null;
var ITEM_ID = null;

// Initialize the Plaid client
var client = new plaid.Client(
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_PUBLIC_KEY,
  plaid.environments[PLAID_ENV]
);

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());


router.get('/', function(request, response, next) {
  response.render('plaid.ejs', {
    PLAID_PUBLIC_KEY: PLAID_PUBLIC_KEY,
    PLAID_ENV: PLAID_ENV,
  });
});

router.get('/id/:id', function(req, res, next) {
  db.Plaid.findById(req.params.id,function(err,foundUser){
    res.json(foundUser);
  });
});

//After the Link Account Button is pressed
router.post('/get_access_token', function(request, response, next) {
  
  console.log("Reached POST /get_access_token");
  PUBLIC_TOKEN = request.body.public_token;
  client.exchangePublicToken(PUBLIC_TOKEN, function(error, tokenResponse) {
    
    //If Error
    if (error != null) 
    {
      var msg = 'Could not exchange public_token!';
      console.log(msg + '\n' + JSON.stringify(error));
      return response.json({ error: msg });
    }
    
    //If no error
    ACCESS_TOKEN = tokenResponse.access_token;
    ITEM_ID = tokenResponse.item_id;
    console.log('Access Token: ' + ACCESS_TOKEN);
    console.log('Item ID: ' + ITEM_ID);
    response.json({ 'error': false, ACCESS_TOKEN, ITEM_ID  });
  });
});


//The link is complete and OnSucess of handler is called
router.post('/get_all', function(request, response, next) {
 
  console.log("Reached POST /get_all");
  ACCESS_TOKEN = request.body.access_token;
  ITEM_ID = request.body.item_id;
  var senderId = request.body.senderId;
  //Create a new Mongo Object
  var objID;
  db.Plaid.create({senderId})
  .then(function(newUser){
      objID = newUser._id;
      console.log("The new object is: " + objID);
      return client.getAuth(ACCESS_TOKEN)
  })
  .then(function(authResponse)
  {
    return db.Plaid.findOneAndUpdate({_id: objID}, {accounts: authResponse.accounts}, {new: true})
  })
  .then(function(user){
      console.log("Accounts updated in DBAAA");
      return client.getItem(ACCESS_TOKEN);
  })
  .then(function(itemResponse){
    //console.log("The ITEM is"+ itemResponse);
    db.Plaid.findOneAndUpdate({_id: objID}, {item: itemResponse.item}, {new: true})
    .then(function(da)
    {
      console.log("Items updated in DBAAA");
    });
    
    return client.getInstitutionById(itemResponse.item.institution_id);
  })
  .then(function(instRes){
    //console.log("The INSTITUTION IS" + instRes.institution);
    return db.Plaid.findOneAndUpdate({_id: objID}, {institution: instRes.institution}, {new: true});
  })
  .then(function(data){
    console.log("Institution is entered!");
    var startDate = moment().subtract(90, 'days').format('YYYY-MM-DD');
    var endDate = moment().format('YYYY-MM-DD');
    
    return client.getTransactions(ACCESS_TOKEN, startDate, endDate, { count: 250, offset: 0, });
  })
  .then(function(transactionsResponse){
    return db.Plaid.findOneAndUpdate({_id: objID}, {transactions: transactionsResponse.transactions}, {new: true});
  })
  .then(function(){
    console.log("Transactions are entered!");
  })
  .catch(function(err){
    var msg = 'Unable to pull accounts from the Plaid API- /GET ALL.';
      console.log(msg + '\n' + JSON.stringify(err));
      return response.json({ error: err });
  });

  
    response.json({'error': false});
});


router.get('/accounts', function(request, response, next) {
  // Retrieve high-level account information and account and routing numbers
  // for each account associated with the Item.
  
  console.log("Reached GET /accounts");
  client.getAuth(ACCESS_TOKEN, function(error, authResponse) {
    
    //If error
    if (error != null) {
      var msg = 'Unable to pull accounts from the Plaid API.';
      console.log(msg + '\n' + JSON.stringify(error));
      return response.json({
        error: msg
      });
    }

    //If no Error
    console.log(authResponse.accounts);
    response.json({
      error: false,
      accounts: authResponse.accounts,
      numbers: authResponse.numbers,
    });
    
  });
});

router.post('/item', function(request, response, next) {
  // Pull the Item - this includes information about available products,
  // billed products, webhook information, and more.
  
  console.log("Reached POST /item");
  client.getItem(ACCESS_TOKEN, function(error, itemResponse) {
    if (error != null) {
      console.log(JSON.stringify(error));
      return response.json({
        error: error
      });
    }

    // Also pull information about the institution
    client.getInstitutionById(itemResponse.item.institution_id, function(err, instRes) {
      if (err != null) {
        var msg = 'Unable to pull institution information from the Plaid API.';
        console.log(msg + '\n' + JSON.stringify(error));
        return response.json({
          error: msg
        });
      } else {
        response.json({
          item: itemResponse.item,
          institution: instRes.institution,
        });
      }
    });
  });
});

router.post('/transactions', function(request, response, next) {
  
  console.log("Reached POST /transactions");
  
  // Pull transactions for the Item for the last 30 days
  var startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
  var endDate = moment().format('YYYY-MM-DD');
  client.getTransactions(ACCESS_TOKEN, startDate, endDate, {
    count: 250,
    offset: 0,
  }, function(error, transactionsResponse) {
    if (error != null) {
      console.log(JSON.stringify(error));
      return response.json({
        error: error
      });
    }
    console.log('pulled ' + transactionsResponse.transactions.length + ' transactions');
    response.json(transactionsResponse);
  });
});


module.exports = router;