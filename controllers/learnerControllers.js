const learnerModel = require("../models/learners");

exports.registerPost = async (req, res) => {
  if (req.params.type === 'normal') {
    const _email = await learnerModel.findLearnerByEmailType(req.body.email, req.params.type);

    if (_email) {
      return res.json({
        status: 444,
        message: "existed account"
      });
    } else {
      await learnerModel.insertLearner(req.body, req.params.type);

      return res.json({
        message: "success"
      });
    }
  }

  if (req.params.type === 'facebook') {
    const _idFb = await learnerModel.findLearnerByIdFb(req.body.idFb);

    if (_idFb) {
      return res.json({
        status: 444,
        message: "existed account"
      });
    } else {
      await learnerModel.insertLearner(req.body, req.params.type);

      return res.json({
        message: "success"
      });
    }
  }

  if (req.params.type === 'google') {
    const _email = await learnerModel.findLearnerByEmailType(req.body.email, req.params.type);

    if (_email) {
      return res.json({
        status: 444,
        message: "existed account"
      });
    } else {
      await learnerModel.insertLearner(req.body, req.params.type);

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
  let _idFb = await learnerModel.findLearnerByIdFb(info.idFb);

  if (_idFb) {
    await learnerModel.updateInfoLearner(_idFb, info);
  } else {
    await learnerModel.insertLearner(info, 'facebook');
  }

  return await learnerModel.findLearnerByIdFb(info.idFb);
};

exports.loginByGoogle = async (info) => {
  let _email = await learnerModel.findLearnerByEmailType(info.email, 'google');

  if (_email) {
    await learnerModel.updateInfoLearner(_email, info);
  } else {
    await learnerModel.insertLearner(info, 'google');
  }

  return await learnerModel.findLearnerByEmailType(info.email, 'google');
};