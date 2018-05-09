var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var User = require('../models/user');
var Admin = require('../models/admin');

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

    user.save(function(err, result) {
        if(err) {
            return res.status(500).json({
                title: 'Error while saving new user.',
                error: err
            })
        }
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
    var emailRegExp = '^' + req.body.email + '$';
    User.findOne({email: {$regex: new RegExp(emailRegExp, 'i')}}, function(err, user) {
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
        
        var expiryTime = 72000000;
        var token = jwt.sign({user: user}, 'secret', {expiresIn: expiryTime});
        return res.status(200).json({
            message: 'Successfully logged in!',
            token: token,
            userId: user._id
        })


    })
})

/**
 * Route that will automatically log a user back in if their browser has a valid token
 * in its local storage
 */
router.post('/loginwithtoken', function(req, res, next) {
    //Check if valid token

    jwt.verify(req.query.token, 'secret', function(err, result) {
        if(err) {
            return res.status(200).json({
                token: '',
                userId: '', 
                valid: false
            })
        }

        //Check if token expired
        var dateNow = new Date();
        console.log('Current Time: ', dateNow.getTime(), 'Exp Time: ', jwt.decode(req.query.token).exp);
        if(jwt.decode(req.query.token).exp * 1000 < dateNow.getTime()) {
            return res.status(200).json({
                token: '',
                userId: '',
                valid: false
            })
        }
        //Token is valid, return to user
        return res.status(200).json({
            token: req.query.token,
            userId: jwt.decode(req.query.token).user._id,
            valid: true
        })
    })
})

/**
 * Route to get a user with the passed id
 */
router.post('/getuser/:id', function(req, res, next) {
    //Decode token
    var decoded = jwt.decode(req.query.token);
    //Get user from database
    User.findById(req.params.id, function(err, user) {
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
        console.log('Found user...');
        //Return the user stripped of sensitive information
        var userJson = {
            firstname: user.firstname,
            lastname: user.lastname,
            createTimestamp: user.createTimestamp
        }

        console.log('Creating user json', userJson);

        return res.status(200).json({
            title: 'User found',
            obj: userJson
        })
    })
})

/**
 * Route to get list of user invites
 */
router.post('/getuserinvites', function(req, res, next) {
    //Decode token
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
                title: 'No user found',
                error: {message: 'No user found'}
            })
        }
        //Found user
        if(user.invites) {
            return res.status(200).json({
                title: 'Invites found',
                obj: user.invites
            })
        }
    })
})

/**
 * Route to change a user password
 */
router.patch('/changepassword', function(req, res, next) {
    //Decode token
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
                title: "User not found",
                error: {message: 'User not found'}
            })
        }
        //Found user -- check if passwords match
        if(!bcrypt.compareSync(req.body.oldPassword, user.password)) {
            return res.status(200).json({
                title: 'Password mismatch',
                obj: false
            })
        }

        //Passwords match -- set new password
        user.password = bcrypt.hashSync(req.body.newPassword, 10);

        //Save changes to db
        user.save(function(err, savedUser) {
            if(err) { 
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                })
            }
            //Successfully saved
            return res.status(201).json({
                title: 'Password changed',
                obj: true
            })
        })
        
    })
    
})

/**
 * Route to check if a user is an admin
 */
router.post('/checkadmin', function(req, res, next) {
    //Get decoded user
    var decoded = jwt.decode(req.query.token);

    //Check if user in admin table
    Admin.find({userId: decoded.user._id}, function(err, admin) {
        if(err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            })
        }
        if(admin === undefined || admin.length == 0) {
            return res.status(200).json({
                isAdmin: false
            })
        }
        //User is admin
        return res.status(200).json({
            isAdmin: true
        })
    })
})

module.exports = router;