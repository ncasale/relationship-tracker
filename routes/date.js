var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var DateModel = require('../models/date');
var Relationship = require('../models/relationship');
var User = require('../models/user');


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

/**
 * Route to add a new date
 */
router.post('/add', function(req, res, next) {
    //Decode token
    var decoded = jwt.decode(req.query.token);
    //Make a new date from the request body
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

/**
 * Route to get all dates associated with particular relationship
 */
router.post('/getdates/:relationshipId', function(req, res, next) {
    //Decode token
    var decoded = jwt.decode(req.query.token);
    //Find relationship
    console.log('Finding relationship...');
    Relationship.findById(req.params.relationshipId, function(err, relationship) {
        if(err){
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        if(!relationship) {
            return res.status(404).json({
                title: 'Relationship not found',
                error: {message: 'Relationship not found'}
            })
        }
        
        //Check to see if this user a member of the relationship
        console.log('Found relationship...');
        var userMatch = false;
        for(var counter=0; counter < relationship.users.length; counter++) {
            if(relationship.users[counter] == decoded.user._id) {
                userMatch = true;
            }
            console.log(counter, relationship.users.length);
            if(counter >= relationship.users.length - 1 && userMatch) {
                //Users match -- get all dates for this relationship
                console.log('User match...');
                DateModel.find({relationshipId: req.params.relationshipId}, function(err, dates) {
                    if(err) {
                        return res.status(500).json({
                            title: 'An error occurred', 
                            error: err
                        })
                    }
                    console.log('Returning...');
                    //Return array of dates, even if null
                    return res.status(200).json({
                        title: "Dates found",
                        obj: dates
                    })
                })
            }
        }
    })
})

router.patch('/edit', function(req, res, next) {
    //Decode our token
    var decoded = jwt.decode(req.query.token);
    //Get date to edit from database
    DateModel.findById(req.body.dateId, function(err, date) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        if(!date) {
            return res.status(404).json({
                title: 'Date not found',
                error: {message: 'Date not found'}
            })
        }
        if(decoded.user._id != date.createUserId) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: {message: 'Not Authenticated'}
            })
        }
        //Edit date
        date.title = req.body.title;
        date.location = req.body.location;
        date.hour = req.body.hour;
        date.minute = req.body.minute;
        date.date = req.body.date;
        date.editTimestamp = Date.now();
        date.editUserId = decoded.user._id;
        //Save date
        date.save(function(err, result) {
            if(err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                })
            }
            //Return success
            return res.status(201).json({
                title: 'Date edited',
                obj: result
            })
        })
    })
})


module.exports = router;