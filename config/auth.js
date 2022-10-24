const path = require("path");

module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated && typeof req.user != "undefined"){
            return next();
        }
        req.flash("error_msg", "Please log in to view dashboard");
        res.redirect(path.join(__dirname+'../public/login.html'));
    }
};