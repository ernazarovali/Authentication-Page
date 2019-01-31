var express = require('express');
var router = express.Router();
var exressValidator = require('express-validator');
var passport = require('passport');
var bcrypt = require('bcryptjs');
var pg = require('pg');
const saltRounds = 10;

//Home page ======================================

router.get('/', function(req, res){
    res.render('home', { title: 'Home'});
});

//Login user ======================================

router.get('/login', function(req, res){
    res.render('login', { title: 'Login Page'});
});

router.post('/login', passport.authenticate('local', { 
    successRedirect: '/profile',
    failureRedirect: '/error',
}));


// Profile Page ======================================
router.get('/profile', function(req, res, next){
    res.render('profile', { title: 'Profile'});
});

// Error Page ======================================
router.get('/error', function(req, res, next){
    res.render('error', { title: 'Error'});
});

//Create a user ======================================

router.get('/register', function(req, res, next){
    res.render('register', { title: 'Registration'});
});

router.post('/register', function(req, res, next){
    req.checkBody('username', 'Username field cannot be empty').notEmpty();
    req.checkBody('email', 'The email is invalid. Please try again').isEmail();
    req.checkBody('password', 'Password field cannot be empty').notEmpty();
    req.checkBody('passwordMatch', 'Password do not match').equals(req.body.password);

    const errors = req.validationErrors();
    
    if(errors){
        console.log(`errors: ${JSON.stringify(errors)}`);

        res.render('register', {
            title: 'Registration Error',
            errors: errors
        });
    } else {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        const db = require('../db.js');
        
        bcrypt.hash(password, saltRounds, function(err, hash){
            db.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, hash], function(error, results, fields){
                if (error) throw error;

                db.query("SELECT CURRVAL (pg_get_serial_sequence('users','id')) as user_id", function(error, results, fields) {
                    if (error) throw error;

                    var user_id = results.rows[0];

                    console.log(user_id);
                    req.login(user_id, function(err) {
                        res.redirect('/profile');
                    })
                })
            });
        });
    }
});

//Passport ======================================
passport.serializeUser(function(user_id, done) {
    done(null, user_id);
});
  
passport.deserializeUser(function(user_id, done) {
    done(null, user_id);
});

module.exports = router;