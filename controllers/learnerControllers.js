const learnerModel = require("../models/learners");

exports.registerPost = async (req, res) => {
  const _email = await learnerModel.findLearnerByEmail(req.body.email);
  
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
};