var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var User = require('../models/user');
var Relationship = require('../models/relationship');

router.use('/', function(req, res, next) {
    jwt.verify(req.query.token, 'secret', function(err, result) {
        if(err) {
            return res.status(401).json({
                title: 'Authentication error', 
                error: err
            })
        }
        next();
    })
})

/**
 * Route used to save a new relationship
 */
router.post('/add', function(req, res, next) {
    var decoded = jwt.decode(req.query.token);
    User.findById(decoded.user._id, function(err, user) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        //Create a new relationship where the only userId in userIds is the current user
        var relationship = new Relationship({
            title: req.body.title,
            users: [user]
        });

        console.log('Save route hit');

        //Save realtionship to database
        relationship.save(function(err, savedRelationship) {
            if(err) {
                return res.status(500).json({
                    title: 'An error occurred', 
                    error: err
                })
            }
            //If no error, add this relationship to list of user relationships and save
            user.relationships.push(savedRelationship);
            user.save();
            return res.status(201).json({
                title: 'Saved Relationship.',
                obj: savedRelationship
            })
        })

    })
})

/**
 * Route to get all relationships belonging to the currently logged in user
 */
router.post('/getrelationships', function(req, res, next) {
    var decoded = jwt.decode(req.query.token);
    var relationships = [];
    var counter = 0;
    var relationshipsLength = 0;
    User.findById(decoded.user._id, function(err, user) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }

        //Get array of relationship ids from user
        //user.relationships
        relationshipsLength = user.relationships.length;
        user.relationships.forEach(function(relationshipId) {
            Relationship.findById(relationshipId, function(err, relationship) {
                if(err) {
                    return res.status(500).json({
                        title: 'An error occurred',
                        error: err
                    })
                }
                if(!relationship) {
                    return res.status(404).json({
                        title: 'Requested relationship does not exist',
                        error: {message: 'Requested relationship does not exist'}
                    })
                }
                //If no error, append to relationships list
                relationships.push(relationship);
                counter++;
                //Wait to return until all relationships processed
                if(counter === relationshipsLength) {
                    return res.status(201).json({
                        title: 'Got Relationships',
                        obj: relationships
                    })
                }
            })
        }) 
    })
})

router.patch('/join:id', function(req, res, next) {
    var decoded = jwt.decode(req.query.token);
    //Find relationship with passed id
    Relationship.findById(req.params.id, function(err, relationship) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        if(!relationship) {
            return res.status(404).json({
                title: 'Could not find relationship',
                error: err
            })
        }
        //Check to see if user listed as invitee on relationship
        var isInvitee = false;
        var counter = 0;
        relationship.invitees.forEach(function(inviteeId) {
            if(inviteeId === decoded.user._id) {
                isInvitee = true;
            }

            //Continue only once loop is done iterating
            if(counter === relationship.invitees.length) {
                if(isInvitee) {
                    //Update the user's relationship array
                    User.findById(decoded.user._id, function(err, user) {
                        if(err) {
                            return res.status(500).json({
                                title: 'An error occurred',
                                error: err
                            });
                        }
                        user.relationships.push(relationship);
                        user.save()

                        //Update the relationship's user array
                        relationship.userIds.push(decoded.user._id);
                        relationship.save(function(err, result) {
                            if(err) {
                                return res.status(500).json({
                                    title: 'An error occurred',
                                    error: err
                                });
                            }
                            return res.status(200).json({
                                title: 'Joined relationship',
                                obj: result
                            });
                        })
                    })
                    
                }
            }
        })
    })
})

/**
 * Route to invite a user to a relationship
 */
router.patch('/invite/:email/:id', function(req, res, next) {
    var decoded = jwt.decode(req.query.token);
    //Find relationship with passed id
    Relationship.findById(req.params.id, function(err, relationship) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        if(!relationship) {
            return res.status(404).json({
                title: 'Could not find relationship',
                error: {message: "Relationship not found"}
            })
        }
        //Get the user with the passed email
        User.findOne({email: req.params.email}, function(err, user) {
            if(err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                })
            } 
            if(!user) {
                return res.status(404).json({
                    title: 'User not found', 
                    error: {message: 'Could not find user'}
                })
            }
            //Save invite to user -- check if invite exists already
            var counter = 0;
            var inviteRelationshipId;
            if(user.invites.length > 0) {
                for(counter = 0; counter < user.invites.length; counter++) {                  
                    inviteRelationshipId = user.invites[counter];
                    if(req.params.id == inviteRelationshipId) {
                        return res.status(403).json({
                            title: 'User already invited!',
                            error: {message: 'User already invited to this relationship!'}
                        });
                        break;
                    }
                    if(counter === user.invites.length - 1) {
                        user.invites.push(relationship._id);
                        user.save();
    
                        //Save user to relationship
                        relationship.invitees.push(user._id);
                        relationship.save(function(err, result) {
                            if(err) {
                                return res.status(500).json({
                                    title: 'An error occurred',
                                    error: err
                                })
                            }
                            return res.status(204).json({
                                title: 'Invite successful',
                                obj: result
                            })
                        })
                        break;    
                    }
                }
            }
            else {
                user.invites.push(relationship._id);
                user.save();

                //Save user to relationship
                relationship.invitees.push(user._id);
                relationship.save(function(err, result) {
                    if(err) {
                        return res.status(500).json({
                            title: 'An error occurred',
                            error: err
                        })
                    }
                    return res.status(204).json({
                        title: 'Invite successful',
                        obj: result
                    })
                })
            }
        })
    })
})

router.post('/getinvitedrelationships', function(req, res, next) {
    var decoded = jwt.decode(req.query.token);
    //Get user using token
    User.findById(decoded.user._id, function(err, user) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        if(!user) {
            return res.status(404).json({
                title: 'User does not exist',
                error: {message: 'User does not exist'}
            })
        }
        //Get list of invited relationships from user
        var relationships = [];
        for(var counter = 0; counter < user.invites.length; counter++) {
            Relationship.findById(user.invites[counter], function(err, relationship) {
                if(err) {
                    return res.status(500).json({
                        title: 'An error occurred',
                        error: err
                    })
                }
                if(!relationship) {
                    return res.status(404).json({
                        title: 'Requested relationship does not exist',
                        error: {message: 'Requested relationship does not exist'}
                    })
                }
                //Push relationship into array
                relationships.push(relationship);

                //Once all invites iterated through, return array
                if(counter == user.invites.length) {
                    return res.status(201).json({
                        title: 'Got Invited Relationships.',
                        obj: relationships
                    })
                }
            })            
        }
    }) 
})

router.patch('/declineinvite/:id', function(req, res, next) {
    var decoded = jwt.decode(req.query.token);
    //Get user
    User.findById(decoded.user._id, function(err, user){
        console.log(decoded);
        if(err) {
            return res.status(500).json({
                title: 'An error occurred', 
                error: err
            })
        }
        if(!user) {
            return res.status(404).json({
                title: 'user not found', 
                error: {message: 'user not found'}
            })
        }
        console.log('Got user');
        //Remove id from list if it exists
        if(!user.invites) {
            for(var counter=0; counter < user.invites.length; counter++) {
                if(req.params.id == user.invites[counter]) {
                    console.log('Removed id');
                    user.invites.splice(counter, 1);
                    user.save();
                }
                if(counter == user.invites.length) {
                    console.log('Returning...');
                    return res.status(201).json({
                        title: 'Invite declined',
                        obj: {}
                    })
                }
            }
        }
        
        //If no invites found, return 404
        return res.status(404).json({
            title: 'No invites found!', 
            error: {message: 'No invites found!'}
        })
            
        })
    
})

module.exports = router;