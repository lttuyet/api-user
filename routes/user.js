var express = require("express");
const jwt = require("jsonwebtoken");
var router = express.Router();
var userController = require("../controllers/userController");
var tagController = require("../controllers/tagControllers");
const passport = require('passport');

// ------------------Chưa đăng nhập------------------------
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

        if (user) {
            const token = jwt.sign(user, 'your_jwt_secret');

            return res.json({
                token,
                role: user.role
            });
        }

        return res.json({
            status: 501,
            message: "Tài khoản không tồn tại!"
        });
    }

    if (req.body.type === 'google') {
        const user = await userController.loginByGoogle(req.body);

        if (user) {
            const token = jwt.sign(user, 'your_jwt_secret');

            return res.json({
                token,
                role: user.role
            });
        }

        return res.json({
            status: 501,
            message: "Tài khoản không tồn tại!"
        });
    }
});

router.get("/typicaltutors", userController.getTypicalTutors);

router.get("/listtutors", userController.getListTutors);

router.get("/listtags", tagController.getAll);

router.post("/detailstutor", userController.getDetailsTutor);

module.exports = router;