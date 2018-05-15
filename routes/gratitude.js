var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var utils = require('./utils');

var Gratitude = require('../models/gratitude');
var Relationship = require('../models/relationship');

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
    //Check that user is authorized to add gratitude to relationship
    gratitude.populate('relationshipId', function(err) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        //Function to call if user authorized to add gratitude
        function addGratitude() {
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
        }
        //Function to call if user not authorized
        let resObj = {res: res};
        let unAuthFunc = unAuth.bind(resObj);
        //Check authorization
        utils.checkRelationship(decoded, gratitude.relationshipId.users, addGratitude, unAuthFunc);
    })
})

/**
 * Route to get all gratitudes for a particular relationship
 */
router.post('/getgratitudes/:relationshipId', function(req, res, next) {
    //Decode token
    var decoded = jwt.decode(req.query.token);
    //Check if user allowed to get gratitudes for this relationship
    Relationship.findById(req.params.relationshipId, function(err, relationship) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        if(!relationship) {
            return res.status(404).json({
                title: 'Relationship not found',
                error: {message: 'Relationship with passed id not found'}
            })
        }
        //Function to call if user is authorized to get gratitudes
        function getGratitudes() {
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
        }
        //Function to call if user not authorized
        let resObj = {res: res};
        let unAuthFunc = unAuth.bind(resObj);
        //Check authorization
        utils.checkRelationship(decoded, relationship.users, getGratitudes, unAuthFunc);
    })
})

/**
 * Route to edit an existing gratitude in the db
 */
router.patch('/edit', function(req, res, next) {
    //Decode token
    var decoded = jwt.decode(req.query.token);
    //Find gratitude
    Gratitude.findById(req.body.gratitudeId, function(err, gratitude) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        if(!gratitude) {
            return res.status(404).json({
                title: 'Gratitude not foudn',
                error: {message: 'Gratitude not found'}
            })
        }
        //Check if user is authorized to edit gratitude
        gratitude.populate('relationshipId', function(err) {
            //Function to call if user is authorized
            function editGratitude() {
                //Found gratitude -- apply edits
                gratitude.title = req.body.title;
                gratitude.text = req.body.text;
                gratitude.editUserId = decoded.user._id;
                gratitude.editTimestamp = Date.now();
        
                //Save gratitude
                gratitude.save(function(err, savedGratitude) {
                    if(err) {
                        return res.status(500).json({
                            title: 'Edited Gratitude',
                            error: err
                        })
                    }
                    //Successfully saved
                    return res.status(201).json({
                        title: 'Gratitude edited',
                        obj: savedGratitude
                    })
                })
            }
            //Function to call if user is not authorized
            let resObj = {res: res};
            let unAuthFunc = unAuth.bind(resObj);
            //Check authorization
            utils.checkRelationship(decoded, gratitude.relationshipId.users, editGratitude, unAuthFunc);
        })
    })
})

/**
 * Route to delete gratitude from db
 */
router.delete('/delete/:gratitudeId', function(req, res, next) {
    //Decode token 
    var decoded = jwt.decode(req.query.token);
    //Get gratitude
    Gratitude.findById(req.params.gratitudeId, function(err, gratitude) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        if(!gratitude) {
            return res.status(404).json({
                title: 'Gratitude not found',
                error: {message: 'Gratitude not found'}
            })
        }
        //Check if user authorized to remove gratitude
        gratitude.populate('relationshipId', function(err) {
            if(err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                })
            }
            //Function to call if user is authorized
            function deleteGratitude() {
                gratitude.remove(function(err, deletedGratitude) {
                    if(err) {
                        return res.status(500).json({
                            title: 'An error occurred',
                            error: err
                        })
                    }
                    //Successfully deleted gratitude
                    return res.status(200).json({
                        title: 'Gratitude deleted',
                        obj: deletedGratitude
                    })
                })
            }
            //Function to call if user not authorized
            let resObj = {res: res};
            let unAuthFunc = unAuth.bind(resObj);
            //Check authorization
            utils.checkRelationship(decoded, gratitude.relationshipId.users, deleteGratitude, unAuthFunc);
        })
    })
})

function unAuth() {
    return this.res.status(401).json({
        title: 'Unauthorized',
        error: {message: 'Unauthorized'}
    })
}

module.exports = router;