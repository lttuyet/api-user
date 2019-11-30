const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.registerPost = async (req, res) => {
  const _email = await User.findUserByEmail(req.body.email);
  
  if (_email) {
    return res.json({
      status: 444,
      message: "existed email"
    });
  } else {
    await User.insertUser(req.body);
    
    return res.json({
      message: "success"
    });
  }
};

exports.updateAccount = async (req, res) => {
  if (!req.user) {
    return res.json({ 
      status: 446,
      message: "account is not existed"
    });
  } else {
    await User.updateInfoUser(req.user,req.body);

    return res.json({
      message: "success"
    });
  }
};

exports.updatePicture = async (req, res) => {
  if (!req.user) {
    return res.json({
      status: 446,
      message: "account is not existed"
    });
  } else {
    await User.updateImageUser(req.user,req.body);

    return res.json({
      message: "success"
    });
  }
};

exports.changePassword = async (req, res) => {
  if (!req.user) {
    return res.json({
      status: 446,
      message: "account is not existed"
    });
  } else {
    // Match password
    const checkOldPass = bcrypt.compare(
      req.body.oldPassword,
      req.user.password
    );

    if (checkOldPass) {
      await User.changePasswordUser(req.user,req.body.newPassword);

      return res.json({
        message: "success"
      });
    } else {
      return res.json({
        status: 447,
        message: "wrong password"
      });
    }
  }
};
