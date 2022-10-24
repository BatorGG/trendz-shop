const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const path = require("path");

// Welcome Page
router.get("/", (req, res) => {
    res.render("welcome");
});

// Dashboard Redirect
router.get("/dashboard", ensureAuthenticated, (req, res) => {
    res.json({
        success: true,
        error: ""
    })
    /*
    res.render("dashboard", {
        name: req.user.name,
        invitedBy: req.user.invitedBy,
        couponCode: req.user.couponCode,
        balanceInCents: req.user.balanceInCents
    });*/
});

// Dashboard
router.post("/getuser", (req, res) => {

    if (req.isAuthenticated()) {
        res.json({
            success: true,
            name: req.user.name,
            invitedBy: req.user.invitedBy,
            couponCode: req.user.couponCode,
            couponCodeEnabled: req.user.couponCodeEnabled,
            balanceInCents: req.user.balanceInCents,
            subscriptionId: req.user.subscriptionId
        })
    }
    else {
        res.json({
            success: false
        })
    }

});


module.exports = router;