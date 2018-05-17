var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var utils = require('./utils');

var Fight = require('../models/fight');
var Relationship = require('../models/relationship');

/**
 * Route to save new fight to database
 */
router.post('/add', function(req, res, next) {
    //Decode token
    var decoded = jwt.decode(req.query.token);
    //Create fight
    var fight = new Fight({
        title: req.body.title,
        descriptions: req.body.descriptions,
        causes: req.body.causes,
        fightDate: req.body.fightDate,
        resolutions: req.body.resolutions,
        relationshipId: req.body.relationshipId,
        createUserId: decoded.user._id
    });
    //See if user authorized to save fight to this relationship
    fight.populate('relationshipId', function(err) {
        //Function to call if user authorized
        function saveFight() {
            fight.save(function(err, savedFight) {
                if(err) {
                    return res.status(500).json({
                        title: 'An error occurred',
                        error: err
                    })
                }
                //Successfully saved
                return res.status(201).json({
                    title: 'Fight saved',
                    obj: savedFight
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
        utils.checkRelationship(decoded, fight.relationshipId.users, saveFight, unAuth);
    })
})

/**
 * Route to get all fights for a particular relationship
 */
router.post('/getfights/:relationshipId', function(req, res, next) {
    //Decode token
    var decoded = jwt.decode(req.query.token);
    //Check that user is a member of relationship
    Relationship.findById(req.params.relationshipId, function(err, relationship) {
        if(err) {
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
        //Function to call if user authorized to get these fights
        function getFights() {
            Fight.find({relationshipId: req.params.relationshipId}, function(err, fights) {
                if(err) {
                    return res.status(500).json({
                        title: 'An error occurred', 
                        error: err
                    })
                }
                //Found fights
                return res.status(200).json({
                    title: 'Fights found',
                    obj: fights
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
        utils.checkRelationship(decoded, relationship.users, getFights, unAuth);
    })
})

/**
 * Route to edit an existing fight in the database
 */
router.patch('/edit', function(req, res, next) {
    //Decode token
    var decoded = jwt.decode(req.query.token);
    //Find fight
    Fight.findById(req.body.fightId, function(err, fight) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        if(!fight) {
            return res.status(404).json({
                title: 'Fight not found',
                error: {message: 'Fight not found'}
            })
        }
        //Check if user authorized to edit fight
        fight.populate('relationshipId', function(err) {
            //Function to call if user is authorized
            function editFight() {
                //Edit fight
                fight.title = req.body.title;
                fight.descriptions = req.body.descriptions;
                fight.causes = req.body.causes;
                fight.resolutions = req.body.resolutions;
                fight.fightDate = req.body.fightDate;
                fight.editUserId = decoded.user._id;
                fight.editTimestamp = Date.now();
                //Save fight
                fight.save(function(err, savedFight) {
                    if(err) {
                        return res.status(500).json({
                            title: 'An error occurred',
                            error: err
                        })
                    }
                    //Successfully saved
                    return res.status(201).json({
                        title: 'Fight Edited',
                        obj: savedFight
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
            utils.checkRelationship(decoded, fight.relationshipId.users, editFight, unAuth);
        })        
    })
})

/**
 * Route to delete an existing fight from the database
 */
router.delete('/delete/:fightId', function(req, res, next) {
    //Decode token
    var decoded = jwt.decode(req.query.token);
    //Get fight
    Fight.findById(req.params.fightId, function(err, fight) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        if(!fight) {
            return res.status(404).json({
                title: 'Fight not found',
                error: {message: 'Fight not found'}
            })
        }
        //Check if user authorized to remove fight
        fight.populate('relationshipId', function(err) {
            //Function to call if user authorized
            function deleteFight() {
                fight.remove(function(err, deletedFight) {
                    if(err) {
                        return res.status(500).json({
                            title: 'An error occurred',
                            error: err
                        })
                    }
                    
                    //Successfully deleted
                    return res.status(200).json({
                        title: 'Fight deleted',
                        obj: deletedFight
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
            utils.checkRelationship(decoded, fight.relationshipId.users, deleteFight, unAuth);
        })
    })
})

/**
 * Route to get a particular fight
 */
router.post('/getFight/:fightId', function(req, res, next) {
    //Decode token
    var decoded = jwt.decode(req.query.token);
    //Get Fight
    Fight.findById(req.params.fightId, function(err, fight) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        if(!fight) {
            return res.status(404).json({
                title: 'Fight not found',
                error: {message: 'Fight not found'}
            })
        }
        //Check if user is authorized to get this fight
        fight.populate('relationshipId', function(err) {
            if(err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                })
            }
            //Function to call if user is authorized
            function getFight() {
                return res.status(200).json({
                    title: 'Fight found',
                    obj: fight
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
            utils.checkRelationship(decoded, fight.relationshipId.users, getFight, unAuth);
        })
    })
})

module.exports = router;