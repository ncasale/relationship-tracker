var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var Feedback = require('../models/feedback');

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
 * Route to add new feedback to db
 */
router.post('/add/', function(req, res, next) {
    //Decode token
    var decoded = jwt.decode(req.query.token);
    //Create the feedback
    var feedback = new Feedback({
        title: req.body.title,
        description: req.body.description,
        createUserId: decoded.user._id
    });
    //Save the feedback
    feedback.save(function(err, savedFeedback) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        //Successfully saved
        return res.status(201).json({
            title: 'Feedback saved',
            obj: savedFeedback
        })
    })

})

/**
 * Route to get all feedback from db
 */
router.post('/getfeedback', function(req, res, next) {
    //Decode token
    var decoded = jwt.decode(req.query.token);
    //Get all feedback
    Feedback.find(function(err, feedback) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred', 
                error: err
            })
        }
        //Found feedback
        return res.status(200).json({
            title: 'Feedback found',
            obj: feedback
        })
    })
})

/**
 * Route to resolve feedback
 */
router.patch('/modify/:feedbackId/:closing', function(req, res, next) {
    //Get decoded token
    var decoded = jwt.decode(req.query.token);
    //Find feedback
    Feedback.findById(req.params.feedbackId, function(err, feedback) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        if(!feedback) {
            return res.status(404).json({
                title: 'Feedback not found',
                error: {message: 'Feedback not found'}
            })
        }
        //Found feedback -- open or close
        feedback.closed = req.params.closing;

        feedback.save(function(err, savedFeedback) {
            if(err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                })
            }
            //Successfully saved
            return res.status(201).json({
                title: 'Feedback closed',
                obj: savedFeedback
            })
        })
    })
})
module.exports = router;