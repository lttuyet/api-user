const userModel = require("../models/users");
const userTagModel = require("../models/user_tag");

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

exports.getTypicalTutors = async (req, res) => {
  const result = await userModel.getTypicalTutors();

  if (result) {
    return res.json({
      tutors: result
    });
  }

  return res.json({
    status: "failed",
    message: "get typical details failed"
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