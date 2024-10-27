function isAuthenticated(req, res, next) {
    if (req.session.adminUser) {
        return next(); // User is authenticated
    }
    res.redirect('/adminLogin'); // Redirect to login if not authenticated
}

module.exports = isAuthenticated;
