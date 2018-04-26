var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var Fight = require('../models/fight');

/**
 * Route to save new fight to database
 */
router.post('/add', function(req, res, next) {
    //Decode token
    var decoded = jwt.decode(req.query.token);

    console.log("Fight body: ", req.body);

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
            title: 'Fight saved',
            obj: savedFight
        })
    })
})

/**
 * Route to get all fights for a particular relationship
 */
router.post('/getfights/:relationshipId', function(req, res, next) {
    //Decode token
    var decoded = jwt.decode(req.query.token);
    //Find all fights with relationshipId
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
        //TODO: Add checking to see that user is member of relationship
        
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
        if(decoded.user._id != fight.createUserId) {
            return res.status(401).json({
                title: 'Authentication error',
                error: {message: 'Authentication error'}
            })
        }
        //Remove fight
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
        //Found fight
        return res.status(200).json({
            title: 'Fight found',
            obj: fight
        })

    })
})

module.exports = router;