var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var Feedback = require('../models/feedback');

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

module.exports = router;