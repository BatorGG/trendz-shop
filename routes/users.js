const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const path = require("path");

const { ensureAuthenticated } = require("../config/auth");

// User model
const User = require("../models/User");


// Register Handle
router.post("/register", async (req, res) => {
    var { name, email, password, password2, invitedBy, couponCode} = req.body;

    if (!password) password = "";
    if (!invitedBy) invitedBy = "";
    if (!couponCode) couponCode = "";
    invitedBy = invitedBy.toUpperCase();
    couponCode = couponCode.toUpperCase();
    var errors = [];

    // Check required fields
    if (!name || !email || !password || !password2 || !invitedBy || !couponCode) {
        errors.push({ msg: "Please fill in all fields"});
    }

    // Check password match
    if (password !== password2) {
        errors.push({ msg: "Passwords do not match"});
    }

    // Check password length
    if (password.length < 6) {
        errors.push({ msg: "Password should be at least 6 characters"});
    }
    
    // Check if invitational coupon code is valid
    await User.findOne({ couponCode: invitedBy})
    .then(user => {
        if (!user) {
            errors.push({ msg: "Not a valid invitational coupon code" })
        }
    });
    
    // Check if coupon code is already in use
    User.findOne({ couponCode: couponCode})
    .then(user => {
        if (user) {
            errors.push({ msg: "Coupon code is already in use, please chose a different one" })
        }
    });


    if (errors.length > 0) {
        res.json({
            errors,
            name,
            email,
            password,
            password2,
            invitedBy,
            couponCode
        });
    }
    else {
        // Validation passed
        User.findOne({ email: email })
        .then(user => {
            if (user) {
                // User already exists
                errors.push({ msg: "Email already in use"});
                res.json( {
                    errors,
                    name,
                    email,
                    password,
                    password2,
                    invitedBy,
                    couponCode
                });
            }
            else {
                // Register user
                const newUser = new User({
                    name,
                    email,
                    password,
                    invitedBy,
                    couponCode,
                    couponCodeEnabled: false,
                    balanceInCents: 0,
                    subscriptionId: " "
                    
                });

                // Hash password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        // Set password to hashed
                        newUser.password = hash;

                        // Save user
                        newUser.save()
                        .then(user => {
                            req.flash("success_msg", "You are now registered and can log in");
                            res.json({errors: []});
                        })
                        .catch(err => console.log(err));
                    });
                });
            }
        });
    }
});


router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/users/login-fail",
        failureFlash: true
    })(req, res, next);
});

router.get("/login-fail", (req, res) => {

    res.json({
        success: false,
        error: res.locals.error
    });
});


// Logout Handle
router.post("/logout", (req, res) => {
    req.logout(err => {
        if(err) {
            return next(err);
        }
        req.flash("success_msg", "You are logged out");
        res.json({
            success: true,
            msg: "You are logged out"
        })

    });

});

// Get User Info
router.post("/getuser", ensureAuthenticated, (req, res) => {
    res.send(req.user);
});

module.exports = router;