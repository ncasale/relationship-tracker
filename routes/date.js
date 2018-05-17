var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var utils = require('./utils');

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

    //Check that user is authorized to save date to this relationship
    newDate.populate('relationshipId', function(err) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        //Function to call if user authorized
        function saveDate() {
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
        }
        //Function to call if user not authorized
        function unAuth() {
            return res.status(401).json({
                title: 'Unauthorized',
                error: {message: 'Unauthorized'}
            })
        }
        //Check authorization
        utils.checkRelationship(decoded, newDate.relationshipId.users, saveDate, unAuth);
    })
})

/**
 * Route to get all dates associated with particular relationship
 */
router.post('/getdates/:relationshipId', function(req, res, next) {
    //Decode token
    let decoded = jwt.decode(req.query.token);
    //Find relationship
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
        //Found relationship, see if user is authorized to get dates
        //Function to call if user is authorized
        function getDates() {
            DateModel.find({relationshipId: req.params.relationshipId}, function(err, dates) {
                if(err) {
                    return res.status(500).json({
                        title: 'An error occurred', 
                        error: err
                    })
                }
                //Return array of dates, even if null
                return res.status(200).json({
                    title: "Dates found",
                    obj: dates
                })
            })
        }
        //Function to call if user is unauthorized
        function unAuth() {
            return res.status(401).json({
                title: 'Unauthorized',
                error: {message: 'Unauthorized'}
            })
        }
        //Check authorization
        utils.checkRelationship(decoded, relationship.users, getDates, unAuth);
    })
})

/**
 * Route to edit a date
 */
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
        //See if user is authorized to edit date
        date.populate('relationshipId', function(err) {
            if(err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                })
            }
            //Function to call if user authorized
            function editDate() {
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
            }
            //Function to call if user unauthorized
            function unAuth() {
                return res.status(401).json({
                    title: 'Unauthorized',
                    error: {message: 'Unauthorized'}
                })
            }
            //Check authorization
            utils.checkRelationship(decoded, date.relationshipId.users, editDate, unAuth);
        })
    })
})

/**
 * Route to delete a date
 */
router.delete('/delete/:id', function(req, res, next) {
    //Decode our token
    var decoded = jwt.decode(req.query.token);
    //Find date in database
    DateModel.findById(req.params.id, function(err, date) {
        if(err) {
            return res.status(500).json({
                title: "An error occurred",
                error: err
            })
        }
        if(!date) {
            return res.status(404).json({
                title: "Date not found",
                error: {message: "Date not found"}
            })
        }
        //See if user authorized to delete date
        date.populate('relationshipId', function(err) {
            //Function to call if user authorized
            function deleteDate() {
                date.remove(function(err, result) {
                    if(err) {
                        return res.status(500).json({
                            title: "An error occurred",
                            error: err
                        })
                    }
                    //Deleted successfully
                    return res.status(200).json({
                        title: "Date deleted.",
                        obj: result
                    })
                })
            }
            //Function to call if user unauthorized
            function unAuth() {
                return res.status(401).json({
                    title: 'Unauthorized',
                    error: {message: 'Unauthorized'}
                })
            }
            //Check authorization
            utils.checkRelationship(decoded, date.relationshipId.users, deleteDate, unAuth);
        })
    })
})


module.exports = router;