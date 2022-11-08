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
});

// Dashboard
router.post("/getuser", (req, res) => {

    if (req.isAuthenticated()) {
        res.json({
            success: true,
            user: req.user,
            name: req.user.name,
            invitedBy: req.user.invitedBy,
            couponCode: req.user.couponCode,
            couponCodeEnabled: req.user.couponCodeEnabled,
            balanceInCents: req.user.balanceInCents,
            subscriptionId: req.user.subscriptionId
        })
    }
    else {
        var userData = req.userData;

        if (userData && userData != "" && typeof userData != "undefined" && userData != null) {
            res.json({
                success: true,
                user: userData.userData,
                name: userData.name,
                invitedBy: userData.invitedBy,
                couponCode: userData.couponCode,
                couponCodeEnabled: userData.couponCodeEnabled,
                balanceInCents: userData.balanceInCents,
                subscriptionId: userData.subscriptionId
            })
        }
        else {
            res.json({
                success: false
            })
        }
    }

});


module.exports = router;