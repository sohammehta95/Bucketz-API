var express = require('express');
var router = express.Router();
var db = require("../models");
var helpers = require("../helpers/signupfuncs");

router.route('/')
 .get(helpers.getForm)
 .post(helpers.makeUser)
 
module.exports = router;