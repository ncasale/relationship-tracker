var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var Chore = require('../models/chore');

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

})

module.exports = router;