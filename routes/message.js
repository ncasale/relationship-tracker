var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var Message = require('../models/message');
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
 * Route to add new message to database
 */
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
            userId: decoded.user._id,
            firstname: user.firstname,
            lastname: user.lastname
        })

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

/**
 * Route to edit a message with the passed id
 */
router.patch('/edit/:id', function(req, res, next) {
    //Get token
    var decoded = jwt.decode(req.query.token);
    //Get the message
    Message.findById(req.params.id, function(err, message) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred', 
                error: err
            })
        }
        //Check if message exists
        if(!message) {
            return res.status(404).json({
                title: 'Message not found',
                error: {message: 'Message not found'}
            })
        }
        //Check if user on message matches user sending request
        if(message.userId != decoded.user._id) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: {message: 'Not Authenticated'}
            })
        }
        //Update message text with edit, and update edit timestamp
        //console.log('Old Message: ', message);
        message.text = req.body.text;
        message.editTimestamp = new Date();
        //console.log('New Message: ', message);
        message.save(function(err, result) {
            if(err) {
                return res.status(500).json({
                    title: 'Error saving message',
                    error: err
                })
            }
            res.status(201).json({
                title: 'Updated message',
                obj: result
            })
        })
    })
})

/**
 * Route to get all messages associated with a passed relationshipId
 */
router.post('/getmessages/:id', function(req, res, next) {
    //Get decoded user token
    var decoded = jwt.decode(req.query.token);
    //Get all messages with relationship id
    Message.find({relationshipId: req.params.id}, function(err, messages) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred', 
                error: err
            })
        }
        if(!messages) {
            return res.status(404).json({
                title: 'No messages found',
                error: {message: 'No messages with that relationship id found'}
            })
        }
        //Return list of messages
        return res.status(200).json({
            title: 'Messages found...',
            obj: messages
        })
    })
})

router.delete('/deletemessage/:id', function(req, res, next) {
    //Decode the token
    var decoded = jwt.decode(req.query.token);
    //Get the message
    Message.findById(req.params.id, function(err, message){
        //Check server error
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        //Check message exists
        if(!message) {
            return res.status(404).json({
                title: 'Message not found',
                error: {message: 'Message not found'}
            })
        }
        //Check message user is same as request user
        if(message.userId != decoded.user._id) {
            return res.status(401).json({
                title: 'Authentication Error',
                error: {message: 'Authentication Error'}
            })
        }
        //Delete the message from the database
        message.remove(function(err, result) {
            if(err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                })
            }
            return res.status(200).json({
                title: 'Message deleted',
                obj: result
            })
        })
    })
})

module.exports = router;