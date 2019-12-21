var express = require("express");
const jwt = require("jsonwebtoken");
var router = express.Router();
var userController = require("../controllers/userController");
var tagController = require("../controllers/tagControllers");
const passport = require('passport');

// ------------------Chưa đăng nhập------------------------
router.get("/typicaltutors", userController.getTypicalTutors);

router.get("/listtutors", userController.getListTutors);

router.post("/register", userController.register);





router.post('/login', async (req, res, next) => {
    if (req.body.type === 'normal') {
        passport.authenticate('local', { session: false }, (err, user, info) => {
            if (info) {
                if (info.message === "Tài khoản đã bị khóa!") {
                    return res.json({
                        status: "failed",
                        message: "Tài khoản đã bị khóa!"
                    });
                }

                if (info.message === "Tài khoản không tồn tại!") {
                    return res.json({
                        status: "failed",
                        message: "Tài khoản không tồn tại!"
                    });
                }
            }

            if (err || !user) {
                return res.json({
                    status: "failed",
                    message: "Lỗi kết nối"
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
                    status: "success",
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
                status: "success",
                token,
                role: user.role
            });
        }

        return res.json({
            status: "failed",
            message: "Tài khoản không tồn tại!"
        });
    }

    if (req.body.type === 'google') {
        const user = await userController.loginByGoogle(req.body);

        if (user) {
            const token = jwt.sign(user, 'your_jwt_secret');

            return res.json({
                status: "success",
                token,
                role: user.role
            });
        }

        return res.json({
            status: "failed",
            message: "Tài khoản không tồn tại!"
        });
    }
});


router.get("/listtags", tagController.getAll);

router.post("/detailstutor", userController.getDetailsTutor);

router.post('/sendforgotpassword', userController.sendForgotPassword);

router.post('/forgotpassword', userController.forgotPassword);

router.post('/sendactivatedcode', userController.sendVerifyCode);

router.post('/activatedcode', userController.verify);

module.exports = router;