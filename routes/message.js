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
    //Create new message
    var message = new Message({
        text: req.body.text,
        relationshipId: req.body.relationshipId,
        userId: decoded.user._id
    })

    //Save message
    message.save(function(err, savedMessage) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        //Successfully saved
        console.log("Saved message: ", savedMessage);
        return res.status(201).json({
            title: 'Message saved',
            obj: savedMessage
        })
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
        console.log('The messages: ',messages);
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