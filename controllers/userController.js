const userModel = require("../models/users");

const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  if (req.body.type === 'normal') {
    // Chỉ được sử dụng 1 email cho 1 tài khoản dù với role nào
    const existedUsers = await userModel.findUserByTypeEmail(req.body.type, req.body.email);

    if (existedUsers) {
      return res.json({
        status: 500,
        message: "existed account"
      });
    } else {
      await userModel.insertUser(req.body, req.body.type);

      return res.json({
        message: "success"
      });
    }
  }

  if (req.body.type === 'facebook') {
    const existedUsers = await userModel.findUserByIdFb(req.body.idFb);

    if (existedUsers) {
      return res.json({
        status: 500,
        message: "existed account"
      });
    } else {
      await userModel.insertUser(req.body, req.body.type);

      return res.json({
        message: "success"
      });
    }
  }

  if (req.body.type === 'google') {
    const existedUsers = await userModel.findUserByIdGg(req.body.idGg);

    if (existedUsers) {
      return res.json({
        status: 500,
        message: "existed account"
      });
    } else {
      await userModel.insertUser(req.body, req.body.type);

      return res.json({
        message: "success"
      });
    }
  }

  return res.json({
    message: "failed"
  });
};