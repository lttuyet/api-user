var express = require("express");
const jwt = require("jsonwebtoken");
var router = express.Router();
var userController = require("../controllers/userController");
const passport = require('passport');

router.post("/register", userController.register);

router.post('/login', async (req, res, next) => {
    if (req.body.type === 'normal') {
        passport.authenticate('local', { session: false }, (err, user, info) => {
            if (err || !user) {
                return res.json({
                    status: 501,
                    message: 'failed login'
                });
            }

            req.login(user, { session: false }, (err) => {
                if (err) {
                    res.send(err);
                }

                const token = jwt.sign(user, 'your_jwt_secret');

                const data = {
                    name: user.name,
                    image: user.image,
                    role: user.role
                }
                return res.json({
                    data,
                    token
                });
            });
        })(req, res, next);
    }

    if (req.body.type === 'facebook') {
        const user = await userController.loginByFacebook(req.body);

        const token = jwt.sign(user, 'your_jwt_secret');

        return res.json({
            token,
            role:user.role
        });
    }

    if (req.params.type === 'google') {
        const user = await userController.loginByGoogle(req.body);

        const token = jwt.sign(user, 'your_jwt_secret');

        return res.json({
            token,
            role:user.role
        });
    }
});

module.exports = router;
