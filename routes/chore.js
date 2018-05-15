var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var utils = require('./utils');

var Chore = require('../models/chore');
var Relationship = require('../models/relationship');

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
                error: {message: "jwt expired"}
            })
        }
        }
        next();
    })
})

/**
 * Route to add a new chore to database
 */
router.post('/add', function(req, res, next) {
    //Decode jwt token
    var decoded = jwt.decode(req.query.token);
    //Create chore
    var chore = new Chore({
        title: req.body.title,
        dueDate: req.body.dueDate,
        assignedUserId: req.body.assignedUserId,
        relationshipId: req.body.relationshipId,
        createUserId: decoded.user._id
    });

    //Get contents of relationship so we can reference valid users
    chore.populate('relationshipId', function(err) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        //Check to see if user a member of relationship
        let foundUser = false;
        const userArray = chore.relationshipId.users;
        //Function to call if user is indeed a member of the relationship
        function saveChore() {
            chore.save(function(err, result) {
                if(err) {
                    return res.status(500).json({
                        title: 'An error occurred',
                        error: err
                    })
                }
                if(!result) {
                    return res.status(500).json({
                        title: "Error while saving chore",
                        error: {message: "Error while saving chore"}
                    })
                }
                //Successfully saved
                return res.status(201).json({
                    title: 'Chore Saved',
                    obj: result
                })
            })
        }
        //Function to call if user is not authorized
        function unAuth() {
            return res.status(401).json({
                title: 'Unauthorized',
                error: {message: 'Unauthorized'}
            })
        }
        //Call checkRelationship
        utils.checkRelationship(decoded, userArray, saveChore, unAuth);

    });
})

/**
 * Route to get chores for particular relationship
 */
router.post('/getchores/:relationshipId', function(req, res, next) {
    //Decode token
    var decoded = jwt.decode(req.query.token);
    //Find relationship and ensure user is a part of it
    Relationship.findById(req.params.relationshipId, function(err, relationship) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        if(!relationship) {
            return res.status(404).json({
                title: 'No relationship found',
                error: {message: 'No relationship with that ID found'}
            })
        }
        //Function to find all chores with passed relationshipId
        function findChores() {
            Chore.find({relationshipId: req.params.relationshipId}, function(err, chores) {
                if(err) {
                    return res.status(500).json({
                        title: 'An error occurred',
                        error: err
                    })
                }
                //Found chores, return to user
                return res.status(200).json({
                    title: 'Chores found',
                    obj: chores
                })
            })
        }
        //Function to call if user is unauthorized
        function unAuth() {
            return res.status(401).json({
                title: 'Unauthorized',
                error: {message: 'Unuathorized'}
            })
        }
        //Call check relationship
        utils.checkRelationship(decoded, relationship.users, findChores, unAuth);
    })
})

/**
 * Route to edit a chore in the database
 */
router.patch('/editchore', function(req, res, next) {
    //Decode token
    var decoded = jwt.decode(req.query.token);
    //Get the chore
    Chore.findById(req.body.choreId, function(err, chore) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        if(!chore) {
            return res.status(404).json({
                title: 'Chore not found',
                error: {message: 'Chore not found'}
            })
        }
        //Chore found, get relationship information
        chore.populate('relationshipId', function(err) {
            if(err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                })
            }
            //Function to call if user is allowed to edit this chore
            function editChore() {
                console.log('Editing chore...');
                //Make edits to chore
                chore.title = req.body.title;
                chore.dueDate = req.body.dueDate;
                chore.assignedUserId = req.body.assignedUserId;
                chore.editTimestamp = Date.now(),
                chore.editUserId = decoded.user._id
        
                //Save chore
                chore.save(function(err, savedChore) {
                    if(err) {
                        return res.status(500).json({
                            title: 'An error occurred',
                            error: err
                        })
                    }
                    //Successfully saved
                    return res.status(201).json({
                        title: 'Chore edited',
                        obj: savedChore
                    })
                })
            }
            //Function to call if this user is not allowed to edit chore
            function unAuth() {
                return res.status(401).json({
                    title: 'Unauthorized',
                    error: {message: 'Unauthorized'}
                })
            }
            //Call authorization check
            utils.checkRelationship(decoded, chore.relationshipId.users, editChore, unAuth);
        })
    })
})

/**
 * Route to delete a chore from database
 */
router.delete('/delete/:choreId', function(req, res, next) {
    //Decode token
    var decoded = jwt.decode(req.query.token);
    //Get chore
    Chore.findById(req.params.choreId, function(err, chore) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        if(!chore) {
            return res.status(404).json({
                title: 'Chore not found',
                error: {message: 'Chore not found'}
            })
        }
        //Found chore, see if user is authorized to delete
        chore.populate('relationshipId', function(err) {
            if(err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                })
            }
            //Function to call if user authorized
            function deleteChore() {
                chore.remove(function(err, result) {
                    if(err) {
                        return res.status(500).json({
                            title: 'An error occurred',
                            error: err
                        })
                    }
                    return res.status(201).json({
                        title: 'Chore deleted',
                        obj: result
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
            utils.checkRelationship(decoded, chore.relationshipId.users, deleteChore, unAuth);
        })        
    })
})

module.exports = router;