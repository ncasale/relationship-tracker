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

module.exports = router;