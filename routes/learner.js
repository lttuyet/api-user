var express = require("express");
var router = express.Router();
var learnerController = require("../controllers/learnerControllers");
var express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();
const passport = require('passport');

router.post("/register&type=:type", learnerController.registerPost);

router.post('/login&type=:type', async (req, res, next) => {
    if (req.params.type === 'normal') {
        passport.authenticate('local', { session: false }, (err, learner, info) => {
            if (err || !learner) {
                return res.json({
                    status: 445,
                    message: 'failed'
                });
            }

            req.login(learner, { session: false }, (err) => {
                if (err) {
                    res.send(err);
                }

                const token = jwt.sign(learner, 'your_jwt_secret');

                const data = {
                    name: learner.name,
                    picture: learner.picture
                }
                return res.json({
                    data,
                    token
                });
            });
        })(req, res, next);
    }

    if (req.params.type === 'facebook') {
        const learner = await learnerController.loginByFacebook(req.body);

        const token = jwt.sign(learner, 'your_jwt_secret');

        return res.json({
            token
        });
    }

    if (req.params.type === 'google') {
        const learner = await learnerController.loginByGoogle(req.body);

        const token = jwt.sign(learner, 'your_jwt_secret');

        return res.json({
            token
        });
    }
});

module.exports = router;