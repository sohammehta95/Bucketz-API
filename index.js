var express = require('express'),
    app = express(),
    cors = require('cors'),
    port = process.env.PORT || 3000,
    bodyParser = require('body-parser');
    
var userRoutes = require("./routes/user");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname +'/public'));
app.use(express.static(__dirname + '/views'));
app.use(cors());

app.get('/', function(req, res){
    res.sendFile("index.html");
});

app.use('/api/users', userRoutes);

app.listen(port, function(){
    console.log("APP IS RUNNING ON PORT " + port);
})
    
    