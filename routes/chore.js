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
                error: {message: "jwt expired"}
            })
        }
        }
        next();
    })
})

/**
 * Route to add a new chore to database
 */
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

/**
 * Route to get chores for particular relationship
 */
router.post('/getchores/:relationshipId', function(req, res, next) {
    //Decode token
    var decoded = jwt.decode(req.query.token);
    //Find all chores with passed relationshipId
    Chore.find({relationshipId: req.params.relationshipId}, function(err, chores) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        //Found chores, return to user
        return res.status(200).json({
            title: 'Chores found',
            obj: chores
        })
    })
})

/**
 * Route to edit a chore in the database
 */
router.patch('/editchore', function(req, res, next) {
    //Decode token
    var decoded = jwt.decode(req.query.token);
    //Get the chore
    Chore.findById(req.body.choreId, function(err, chore) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        if(!chore) {
            return res.status(404).json({
                title: 'Chore not found',
                error: {message: 'Chore not found'}
            })
        }
        //Make edits to chore
        chore.title = req.body.title;
        chore.dueDate = req.body.dueDate;
        chore.assignedUserId = req.body.assignedUserId;
        chore.editTimestamp = Date.now(),
        chore.editUserId = decoded.user._id

        //Save chore
        chore.save(function(err, savedChore) {
            if(err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                })
            }
            //Successfully saved
            return res.status(201).json({
                title: 'Chore edited',
                obj: savedChore
            })
        })
    })
})

/**
 * Route to delete a chore from database
 */
router.delete('/delete/:choreId', function(req, res, next) {
    //Decode token
    var decoded = jwt.decode(req.query.token);
    //Get chore
    Chore.findById(req.params.choreId, function(err, chore) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        if(!chore) {
            return res.status(404).json({
                title: 'Chore not found',
                error: {message: 'Chore not found'}
            })
        }
        if(decoded.user._id != chore.createUserId) {
            return res.status(401).json({
                title: 'Authentication error',
                error: {message: 'Authentication error'}
            })
        }
        //Delete chore
        chore.remove(function(err, result) {
            if(err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                })
            }
            return res.status(201).json({
                title: 'Chore deleted',
                obj: result
            })
        })
    })
})

module.exports = router;