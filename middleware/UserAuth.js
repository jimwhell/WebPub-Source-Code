function isUserAuthenticated(req, res, next)
{
    if (req.session.user)
    {
        return next();
    }
    res.redirect('/userLogin');
}

module.exports = isUserAuthenticated; 