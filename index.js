var express = require('express'),
    app = express(),
    cors = require('cors'),
    port = process.env.PORT || 3000,
    bodyParser = require('body-parser');
    
var db = require('./models'); //For signup
    
var userRoutes = require("./routes/user");
var plaidRoutes = require("./routes/plaid");
var signupRoutes = require("./routes/signup");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname +'/public'));
app.use(express.static(__dirname + '/views'));
app.use(cors());

app.get('/', function(req, res){
    res.render("home.ejs");
});


app.get('/api', function(req, res){
    console.log("here");
    res.render("api.ejs");
});

app.get('/help', function(req, res){
    res.render("help.ejs");
});

app.use('/signup', signupRoutes);
app.use('/api/users', userRoutes);
app.use('/plaid', plaidRoutes);

app.listen(port, function(){
    console.log("APP IS RUNNING ON PORT " + port);
})
    
    