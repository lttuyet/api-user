const userModel = require("../models/users");
const userTagModel = require("../models/user_tag");
const contractModel = require("../models/contracts");
var randomstring = require("randomstring");
const mailer = require('../nodemailer');
require('dotenv').config();
const bcrypt = require('bcryptjs');

// -------------------get typical tutors------------------------
exports.getTypicalTutors = async (req, res) => { 
  try{
    const result = await userModel.getTypicalTutors();

    if (result) {
      return res.json({
        status:"success",
        tutors: result
      });
    }

    return res.json({
      status: "failed",
      message: "get typical details failed"
    });
  }catch(e){
    return res.json({
      status: "failed",
      message: "get typical details failed"
    });
  }
};









exports.register = async (req, res) => {
  if (req.body.type === 'normal') {
    // Chỉ được sử dụng 1 email cho 1 tài khoản dù với role nào
    const existedUsers = await userModel.findUserByTypeEmail(req.body.type, req.body.email);

    /* if (existedUsers) {
      return res.json({
        status: 500,
        message: "existed account"
      });
    } else */{
      const secretToken = randomstring.generate(6);

      await userModel.insertUser(req.body, req.body.type, secretToken);

      const html = "Chào bạn,<br>Mã xác thực đăng ký tài khoản của bạn là:<br>Code:<b>" + secretToken + "</b><br>Truy cập trang này để xác nhận:<a href='http://localhost:3000'>http://localhost:3000</a>";

      await mailer.sendMail("webthuvien123@gmail.com", "lethituyet687@gmail.com", "[uber4tutor] Xác thực tài khoản", html);

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
      const secretToken = randomstring.generate(6);

      await userModel.insertUser(req.body, req.body.type, secretToken);

      const html = "Chào bạn,<br>Mã xác thực đăng ký tài khoản của bạn là:<br>Code:<b>" + secretToken + "</b><br>Truy cập trang này để xác nhận:<a href='http://localhost:3000'>http://localhost:3000</a>";

      await mailer.sendMail(process.env.EMAIL, newCustomer.email, "[uber4tutor] Xác thực tài khoản", html);

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
      const secretToken = randomstring.generate(6);

      await userModel.insertUser(req.body, req.body.type, secretToken);

      const html = "Chào bạn,<br>Mã xác thực đăng ký tài khoản của bạn là:<br>Code:<b>" + secretToken + "</b><br>Truy cập trang này để xác nhận:<a href='http://localhost:3000'>http://localhost:3000</a>";

      await mailer.sendMail(process.env.EMAIL, newCustomer.email, "[uber4tutor] Xác thực tài khoản", html);

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
    await userModel.updateInfoUser(_idFb, info);

    return await userModel.findUserByIdFb(info.idFb);
  }

  return false;
};

exports.loginByGoogle = async (info) => {
  let _email = await userModel.findUserByIdGg(info.idGg);

  if (_email) {
    await userModel.updateInfoUser(_email, info);

    return await userModel.findUserByIdGg(info.idGg);
  }

  return false;
};

exports.getDetailsTutor = async (req, res) => {
  const _tutor = await userModel.getDetails(req.body.id);
  const _tags = await userTagModel.findByUser(req.body.id);

  if (!_tutor || !_tags) {
    return res.json({
      status: 508,
      message: "not found tutor"
    });
  }

  return res.json({
    tutor: _tutor,
    tags: _tags
  });
};

exports.getDetails = async (req, res) => {
  try {
    const _user = req.user;

    if (_user.role === 'tutor') {
      const _tags = await userTagModel.findByUser(_user._id);

      if (!_tags) {
        return res.json({
          status: 507,
          message: "get details user failed"
        });
      }

      return res.json({
        user: _user,
        tags: _tags
      });
    } else {
      if (!_user) {
        return res.json({
          status: 507,
          message: "get details user failed"
        });
      }

      return res.json({
        user: _user
      });
    }

  } catch (e) {
    return res.json({
      status: 507,
      message: "get details user failed"
    });
  }
};

exports.updateBasic = async (req, res) => {
  const result = await userModel.updateBasic(req.user._id, req.body);

  if (result) {
    return res.json({
      message: "success"
    });
  }

  return res.json({
    status: 509,
    message: "update basic info user failed"
  });
};

exports.updateImage = async (req, res) => {
  const result = await userModel.updateImage(req.user._id, req.body.image);

  if (result) {
    return res.json({
      message: "success"
    });
  }

  return res.json({
    status: 510,
    message: "update image failed"
  });
};

exports.getListTutors = async (req, res) => {
  const _tutors = await userModel.getListTutors();

  if (!_tutors) {
    return res.json({
      status: "failed",
      message: "get list tutors failed"
    });
  }

  return res.json({
    tutors: _tutors
  });
};

exports.getDetailsTutor = async (req, res) => {
  try {
    const _tutor = await userModel.getDetails(req.body.id);

    if (!_tutor) {
      return res.json({
        status: "failed",
        message: "get detailed tutor failed"
      });
    }

    const tutor = {
      _id: _tutor._id,
      name: _tutor.name,
      image: _tutor.image,
      address: _tutor.address,
      intro: _tutor.intro,
      price: _tutor.price,
    };
    const _tags = await userTagModel.findByUser(req.body.id);
    const _contracts = await contractModel.findByTutor(req.body.id);

    return res.json({
      status: "success",
      tutor: tutor,
      tags: _tags,
      contracts: _contracts
    });
  } catch (e) {
    return res.json({
      status: "failed",
      message: "get details tutor failed"
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
  const user = await userModel.findUserByEmail(req.body.email);

  if (!user) {
    return res.json({
      status: "failed",
      message: "Tài khoản chưa đăng ký!"
    });
  }

  if (user.isblocked) {
    return res.json({
      status: "failed",
      message: "Tài khoản đã bị khóa!"
    });
  }

  const verifyPassCode = randomstring.generate(6);

  await userModel.updateVerifyCode(user._id,verifyPassCode);

  const html = "Chào bạn,<br>Mã xác thực quên mật khẩu của bạn là:<br>Mã xác thực quên mật khẩu:<b>" + verifyPassCode + "</b><br>Truy cập trang này để đăng nhập:<a href='http://localhost:3000'>http://localhost:3000</a>";
  await mailer.sendMail(process.env.EMAIL, user.email, "[uber4tutor] Xác thực quên mật khẩu", html);

  
    return res.json({
      status: "success",
      message: "success"
    });
  } catch (e) {
    return res.json({
      status: "failed",
      message: "Yêu cầu gửi mã xác thực quên mật khẩu thất bại!"
    });
  }
};

exports.verify = async (req, res) => {
  try {
    return res.json({
      status: "success",
      message: "success"
    });
  } catch (e) {
    return res.json({
      status: "failed",
      message: "forgot password failed"
    });
  }
};

exports.sendVerifyCode = async (req, res) => {
  try {
    return res.json({
      status: "success",
      message: "success"
    });
  } catch (e) {
    return res.json({
      status: "failed",
      message: "forgot password failed"
    });
  }
};

exports.sendForgotPassword = async (req, res) => {
  try {
    return res.json({
      status: "success",
      message: "success"
    });
  } catch (e) {
    return res.json({
      status: "failed",
      message: "forgot password failed"
    });
  }
};

