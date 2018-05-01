var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var Gratitude = require('../models/gratitude');

/**
 * Route to add new gratitude to database
 */
router.post('/add', function(req, res, next) {
    //Decode token
    var decoded = jwt.decode(req.query.token);
    //Create gratitude
    var gratitude = new Gratitude({
            title: req.body.title,
            text: req.body.text,
            relationshipId: req.body.relationshipId,
            createUserId: decoded.user._id
        });
    //Save new gratitude
    gratitude.save(function(err, savedGratitude) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        //Successfully saved
        return res.status(201).json({
            title: 'Gratitude saved',
            obj: savedGratitude
        })
    })
})

/**
 * Route to get all gratitudes for a particular relationship
 */
router.post('/getgratitudes/:relationshipId', function(req, res, next) {
    //Decode token
    var decoded = jwt.decode(req.query.token);
    //Get all gratitudes with relationship ID
    Gratitude.find({relationshipId: req.params.relationshipId}, function(err, gratitudes) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        //Return gratitudes
        return res.status(200).json({
            title: 'Gratitudes Found',
            obj: gratitudes
        })
    })
})


module.exports = router;