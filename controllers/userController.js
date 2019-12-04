const userModel = require("../models/users");

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
    const existedUsers = await userModel.findUserByTypeEmail('google',req.body.email);

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

exports.loginByFacebook = async (info) => {
  let _idFb = await userModel.findUserByIdFb(info.idFb);

  if (_idFb) {
    await userModel.updateInfoUser(_email, info);

    return true;
  }

  return false;
};

exports.loginByGoogle = async (info) => {
  let _email = await userModel.findUserByIdGg(info.idGg);

  if (_email) {
    await userModel.updateInfoUser(_email, info);

    return true;
  }

  return false;
};