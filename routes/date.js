var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var DateModel = require('../models/date');


/**
 * Ensure that token is valid
 */
router.use('/', function(req, res, next) {
    //Check if valid token
    jwt.verify(req.query.token, 'secret', function(err, result) {
        if(err) {
            return res.status(401).json({
                title: 'Authentication error', 
                error: err
            })

        //Check if token expired
        var dateNow = new Date();
        if(jwt.decode(req.query.token).exp < dateNow.getTime()) {
            return res.status(401).json({
                title: 'Authentication Error',
                error: {message: "JWT token has expired -- please login again"}
            })
        }
        }
        next();
    })
})

router.post('/add', function(req, res, next) {
    //Decode token
    var decoded = jwt.decode(req.query.token);
    //Make a new date from the request body
    console.log(req.body);
    var newDate = new DateModel({
        title: req.body.title,
        location: req.body.location,
        hour: req.body.hour,
        minute: req.body.minute,
        date: req.body.date,
        relationshipId: req.body.relationshipId,
        createUserId: decoded.user._id
    });

    //Save date
    newDate.save(function(err, savedDate) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        if(!savedDate) {
            return res.status(500).json({
                title: 'An error occurred',
                error: {message: 'Error while saving date'}
            })
        }
        return res.status(200).json({
            title: 'Date saved',
            obj: savedDate
        })
    })

})


module.exports = router;