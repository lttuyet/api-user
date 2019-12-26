const userModel = require("../models/users");
const userTagModel = require("../models/user_tag");
const contractModel = require("../models/contracts");
var randomstring = require("randomstring");
const mailer = require('../nodemailer');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const SALT_ROUNDS = 10;

exports.getTypicalTutors = async (req, res) => {
  try {
    const result = await userModel.getTypicalTutors();

    if (result) {
      return res.json({
        status: "success",
        tutors: result
      });
    }

    return res.json({
      status: "failed",
      message: "get typical details failed"
    });
  } catch (e) {
    return res.json({
      status: "failed",
      message: "get typical details failed"
    });
  }
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

exports.register = async (req, res) => {
  let isExisted = false;

  switch (req.body.type) {
    case 'normal': {
      try {
        isExisted = await userModel.findUserByTypeEmail(req.body.type, req.body.email);
      } catch (e) {
        return res.json({
          status: "failed",
          message: "Lỗi kết nối! Vui lòng thử lại!"
        });
      }

      break;
    }
    case 'facebook': {
      try {
        isExisted = await userModel.findUserByIdFb(req.body.idFb);
      } catch (e) {
        return res.json({
          status: "failed",
          message: "Lỗi kết nối! Vui lòng thử lại!"
        });
      }

      break;
    }
    case 'google': {
      try {
        isExisted = await userModel.findUserByIdGg(req.body.idGg);
      } catch (e) {
        return res.json({
          status: "failed",
          message: "Lỗi kết nối! Vui lòng thử lại!"
        });
      }

      break;
    }
    default:
  }

  if (isExisted) {
    return res.json({
      status: "failed",
      message: "Tài khoản đã tồn tại!"
    });
  }
  try {
    const secretToken = randomstring.generate(6);

    await userModel.insertUser(req.body, req.body.type, secretToken);

    const newUser = await userModel.findUserByTypeEmail(req.body.type, req.body.email);
    const html = "Chào bạn,<br>Mã xác thực đăng ký tài khoản của bạn là:<br>Code:<b>" + secretToken + "</b><br>Truy cập trang này để xác thực đăng ký tài khoản:<a href='http://localhost:3000/activate&id=" + newUser._id + "'>http://localhost:3000/activate&id=" + newUser._id + "</a>";

    await mailer.sendMail(process.env.PORT, req.body.email, "[uber4tutor] Xác thực đăng ký tài khoản người dùng", html);

    return res.json({
      status: "success",
      id: newUser._id,
      message: "success"
    });
  } catch (e) {
    return res.json({
      status: "failed",
      message: "Lỗi kết nối! Vui lòng thử lại!"
    });
  }
};

exports.checkStatus = async (req, res) => {
  try {
    const id = ObjectId(req.body.id);
  } catch (e) {
    return res.json({
      status: "failed",
      message: "Tài khoản không tồn tại!"
    });
  }
  try {
    const result = await userModel.findUserById(req.body.id);

    if (!result) {
      return res.json({
        status: "success",
        message: "Tài khoản không tồn tại!",
        codeMess: 1
      });
    }

    if (result.isblocked) {
      return res.json({
        status: "success",
        email: result.email,
        message: "Tài khoản đã bị khóa!",
        codeMess: 2
      });
    }

    if (result.isActivated) {
      return res.json({
        status: "success",
        email: result.email,
        message: "Tài khoản đã được kích hoạt!",
        codeMess: 3
      });
    }

    if (!result.isActivated) {
      return res.json({
        status: "success",
        email: result.email,
        message: "Tài khoản chưa được kích hoạt! Vui lòng kiểm tra email!",
        codeMess: 4
      });
    }

    if (result.verifyCode === "") {
      return res.json({
        status: "success",
        email: result.email,
        message: "Tài khoản chưa yêu cầu gửi mã xác nhận!",
        codeMess: 5
      });
    }
  } catch (e) {
    return res.json({
      status: "failed",
      message: "Kết nối lỗi! Vui lòng thử lại!",
      codeMess: 0
    });
  }
};

exports.activatedCode = async (req, res) => {
  try {
    const id = ObjectId(req.body.id);
  } catch (e) {
    return res.json({
      status: "failed",
      message: "Tài khoản không tồn tại!"
    });
  }

  try {
    const user = await userModel.findUserById(req.body.id);

    if (!user) {
      return res.json({
        status: "failed",
        message: "Tài khoản không tồn tại!"
      });
    }
    if (user.isblocked) {
      return res.json({
        status: "failed",
        message: "Tài khoản đã bị khóa!"
      });
    }

    if (user.isActivated) {
      return res.json({
        status: "success",
        message: "Tài khoản đã được kích hoạt!"
      });
    }

    if (user.verifyCode !== req.body.code) {
      return res.json({
        status: "failed",
        message: "Sai mã xác thực!"
      });
    }

    const result = await userModel.activatedCode(req.body.id);

    if (result) {
      return res.json({
        status: "success",
        message: "Tài khoản đã được kích hoạt!"
      });
    }

    return res.json({
      status: "failed",
      message: "Kết nối lỗi! Vui lòng thử lại!"
    });
  } catch (e) {
    return res.json({
      status: "failed",
      message: "Kết nối lỗi! Vui lòng thử lại!"
    });
  }
};

exports.sendVerifyCode = async (req, res) => {
  try {
    const user = await userModel.findUserByTypeEmail('normal', req.body.email);

    if (!user) {
      const fbUser = await userModel.findUserByTypeEmail('facebook', req.body.email);

      if (fbUser) {
        return res.json({
          status: "failed",
          message: "Tài khoản đăng kí bằng facebook nên không thể thực hiện chức năng này!"
        });
      }

      const ggUser = await userModel.findUserByTypeEmail('google', req.body.email);

      if (ggUser) {
        return res.json({
          status: "failed",
          message: "Tài khoản đăng kí bằng google nên không thể thực hiện chức năng này!"
        });
      }

      return res.json({
        status: "failed",
        message: "Tài khoản không tồn tại!"
      });
    }

    if (!user.isActivated) {
      return res.json({
        status: "failed",
        message: "Tài khoản này chưa được kích hoạt! Vui lòng kiểm tra email!"
      });
    }

    const secretToken = randomstring.generate(6);

    const html = "Chào bạn,<br>Mã xác thực quên mật khẩu của bạn là:<br>Code:<b>" + secretToken + "</b><br>Truy cập trang này để xác thực quên mật khẩu người dùng:<a href='http://localhost:3000/verify&id=" + user._id + "'>http://localhost:3000/verify&id=" + user._id + "</a>";

    await mailer.sendMail(process.env.PORT, req.body.email, "[uber4tutor] Xác thực quên mật khẩu tài khoản người dùng", html);

    await userModel.sendForgotPassword(user._id, secretToken);

    return res.json({
      status: "success",
      id: user._id,
      message: "success"
    });
  } catch (e) {
    return res.json({
      status: "failed",
      message: "Kết nối lỗi! Vui lòng thử lại!"
    });
  }
};

exports.verifyCode = async (req, res) => {
  try {
    const id = ObjectId(req.body.id);
  } catch (e) {
    return res.json({
      status: "failed",
      message: "Tài khoản không tồn tại!"
    });
  }

  try {
    const user = await userModel.findUserById(req.body.id);

    if (!user) {
      return res.json({
        status: "failed",
        message: "Tài khoản không tồn tại!"
      });
    }
    if (user.isblocked) {
      return res.json({
        status: "failed",
        message: "Tài khoản đã bị khóa!"
      });
    }

    if (!user.isActivated) {
      return res.json({
        status: "failed",
        message: "Tài khoản chưa được kích hoạt! Vui lòng kiểm tra email!"
      });
    }

    if (user.verifyCode === "") {
      return res.json({
        status: "failed",
        message: "Tài khoản chưa yêu cầu gửi mã xác thực quên mật khẩu người dùng!"
      });
    }

    if (user.verifyCode !== req.body.code) {
      return res.json({
        status: "failed",
        message: "Sai mã xác thực!"
      });
    }

    return res.json({
      status: "success",
      message: "Mã xác thực hợp lệ!"
    });
  } catch (e) {
    return res.json({
      status: "failed",
      message: "Kết nối lỗi! Vui lòng thử lại!"
    });
  }
};

exports.recoverPassword = async (req, res) => {
  try {
    const id = ObjectId(req.body.id);
  } catch (e) {
    return res.json({
      status: "failed",
      message: "Tài khoản không tồn tại!"
    });
  }

  try {
    const user = await userModel.findUserById(req.body.id);

    if (!user) {
      return res.json({
        status: "failed",
        message: "Tài khoản không tồn tại!"
      });
    }
    if (user.isblocked) {
      return res.json({
        status: "failed",
        message: "Tài khoản đã bị khóa!"
      });
    }

    if (!user.isActivated) {
      return res.json({
        status: "failed",
        message: "Tài khoản chưa được kích hoạt!"
      });
    }

    if (user.verifyCode === "") {
      return res.json({
        status: "failed",
        message: "Tài khoản chưa yêu cầu gửi mã xác thực quên mật khẩu người dùng!"
      });
    }

    if (user.verifyCode !== req.body.code) {
      return res.json({
        status: "failed",
        message: "Sai mã xác thực!"
      });
    }

    await userModel.recoverPassword(user._id, req.body.newPass);

    const _token = jwt.sign(user, 'your_jwt_secret');

    return res.json({
      status: "success",
      message: "Đã đổi mật khẩu thành công!",
      role: user.role,
      name: user.name,
      image: user.image,
      token: _token
    });
  } catch (e) {
    return res.json({
      status: "failed",
      message: "Kết nối lỗi! Vui lòng thử lại!"
    });
  }
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

exports.getDetails = async (req, res) => {
  try {
    const _user = req.user;

    if (!_user) {
      return res.json({
        status: "failed",
        message: "get details failed"
      });
    }

    const _tags = await userTagModel.findByUser(_user._id);

    const user = {
      _id: _user._id,
      name: _user.name,
      image: _user.image,
      address: _user.address,
      intro: _user.intro,
      price: _user.price,
      tags: _tags,
      role: _user.role
    };

    return res.json({
      status: "success",
      user: user
    });
  } catch (e) {
    return res.json({
      status: "failed",
      message: "get details user failed"
    });
  }
};

exports.updateImage = async (req, res) => {
  const result = await userModel.updateImage(req.user._id, req.body.image);

  if (result) {
    return res.json({
      status: "success",
      message: "Cập nhật ảnh đại diện thành công!"
    });
  }

  return res.json({
    status: "failed",
    message: "Cập nhật ảnh đại diện thất bại! Vui lòng thử lại!"
  });
};

exports.updateBasic = async (req, res) => {
  const result = await userModel.updateBasic(req.user._id, req.body);

  if (result) {
    return res.json({
      status: "success",
      message: "success"
    });
  }

  return res.json({
    status: "failed",
    message: "Cập nhật thông tin cá nhân thất bại!"
  });
};

exports.updateTutorInfo = async (req, res) => {
  try {
    const updateBasicTutor = await userModel.updateBasicTutor(req.user._id, req.body.intro, req.body.price);
    const updateTagTutor = await userTagModel.updateTagTutor(req.user._id, req.body.tags);

    if (updateBasicTutor && updateTagTutor) {
      return res.json({
        status: "success",
        message: "success"
      });
    }

    return res.json({
      status: "failed",
      message: "Cập nhật thông tin gia sư thất bại!"
    });
  } catch{
    return res.json({
      status: "failed",
      message: "Cập nhật thông tin cá nhân thất bại!"
    });
  }
};

exports.changePass = async (req, res) => {
  try {
    const checkOldPass = await bcrypt.compare(req.body.oldPass, req.user.password.toString());

    if (checkOldPass) {
      const newHashPass = await bcrypt.hash(req.body.newPass, SALT_ROUNDS);

      await userModel.changePass(req.user._id, newHashPass);

      return res.json({
        status: 'success',
        message: 'Đổi mật khẩu thành công!'
      });
    } else {
      return res.json({
        status: "failed",
        message: 'Mật khẩu hiện tại không đúng! Vui lòng thử lại!'
      });
    }
  } catch (e) {
    return res.json({
      status: "failed",
      message: "Đổi mật khẩu thất bại! Vui lòng thử lại!"
    });
  }
};

exports.getTutorContracts = async (req, res) => {
  try {
    const _contracts = await contractModel.findByTutor(req.user._id);

    return res.json({
      status: "success",
      contracts: _contracts
    });
  } catch (e) {
    return res.json({
      status: "failed",
      message: "Lấy danh sách hợp đồng gia sư thất bại!"
    });
  }
};

