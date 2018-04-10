var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var Message = require('../models/message');
var Relationship = require('../models/relationship');
var User = require('../models/user');


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
    //Get decoded token
    var decoded = jwt.decode(req.query.token);
    //Get user
    User.findById(decoded.user._id, function(err, user) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        if(!user) {
            return res.status(404).json({
                title: 'User not found',
                error: {message: 'User not found'}
            })
        }
        //Create message
        var message = new Message({
            text: req.body.text,
            relationshipId: req.body.relationshipId,
            userId: decoded.user._id
        })

        console.log('The Message: ', message);

        //Iterate through user list of relationships and find the one to which we are adding
        //this message
        var relationshipId = "";
        
        for(var relationshipIndex=0; relationshipIndex < user.relationships.length; relationshipIndex++) {
            
            if(user.relationships[relationshipIndex].equals(message.relationshipId)) {
                relationshipId = user.relationships[relationshipIndex];
            }

            if(relationshipIndex == user.relationships.length - 1) {
                if(relationshipId == "") {
                    return res.status(403).json({
                        title: 'User not a member of relationship',
                        error: {message: 'User not a member of relationship'}
                    })
                }
                //Get the relationship
                Relationship.findById(relationshipId, function(err, relationship) {
                    if(err) {
                        return res.status(500).json({
                            title: 'An error occurred',
                            error: err
                        })
                    }
                    if(!relationship) {
                        return res.status(404).json({
                            title: 'Relationship Not Found',
                            error: {message: 'Relationship Not Found'}
                        })
                    }
                    //Add message to relationship and save
                    relationship.messages.push(message);
                    relationship.save();

                    //Save messsage
                    message.save(function(err, result) {
                        if(err) {
                            return res.status(500).json({
                                title: 'An error occurred',
                                error: err
                            })
                        }
                        //If successfully saved, return 201 and saved message
                        return res.status(201).json({
                            title: 'Message saved',
                            obj: result
                        })
                    })

                })
            }
        }
    })
})

module.exports = router;