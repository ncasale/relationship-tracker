var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var User = require('../models/user');

/**
 * Route to create new user
 */
router.post('/', function(req, res, next) {
    var user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    });

    console.log('Creating new user');

    user.save(function(err, result) {
        if(err) {
            console.log('Error creating user');
            return res.status(500).json({
                title: 'Error while saving new user.',
                error: err
            })
        }
        console.log('Successfully created user');
        res.status(201).json({
            title: 'User successfully created',
            obj: result
        })
    })

})

/**
 * Route to log user in
 */
router.post('/login', function(req, res, next) {
    console.log(req.body.email);
    User.findOne({email: req.body.email}, function(err, user) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        if(!user) {
            return res.status(401).json({
                title: 'Invalid login credentials',
                error: {message: 'Invalid login credentials'}
            })
        }
        if(!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).json({
                title: 'Invalid login credentials',
                error: {message: 'Invalid login credentials'}
            })
        }
        var expirationTime = 7200;
        var token = jwt.sign({user: user}, 'secret', {expiresIn: expirationTime});
        return res.status(200).json({
            message: 'Successfully logged in!',
            token: token,
            userId: user._id
        })


    })
})

module.exports = router;