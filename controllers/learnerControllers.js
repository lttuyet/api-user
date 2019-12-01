const learnerModel = require("../models/learners");

exports.registerPost = async (req, res) => {
  if (req.params.type === 'normal') {
    const _email = await learnerModel.findLearnerByEmailType(req.body.email,req.params.type);

    if (_email) {
      return res.json({
        status: 444,
        message: "existed email"
      });
    } else {
      await learnerModel.insertLearner(req.body,req.params.type);

      return res.json({
        message: "success"
      });
    }
  }

  if(req.params.type==='facebook'){
    const _id = await learnerModel.findLearnerByEmail(req.body.email);

    if (_email) {
      return res.json({
        status: 444,
        message: "existed email"
      });
    } else {
      await learnerModel.insertLearner(req.body);

      return res.json({
        message: "success"
      });
    }
  }

  return res.json({
    message: "không nhận được type"
  });


};