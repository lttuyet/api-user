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